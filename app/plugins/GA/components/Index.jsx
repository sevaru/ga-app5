//styles
import './styles.css';

//libs
import React from 'react';
import { isEmpty } from 'lodash';
import { Button, Grid, Col, Row, ButtonGroup, Panel, ProgressBar } from 'react-bootstrap';
import { Graph } from './Graph';
import Player from '../../../players/soundfont-player/Player.js';

//Components
import GAOptions from './GAOptions.jsx';
import { GARunner } from '../lib/ga/GARunner.js';
import { IndividualsTable } from './IndividualsTable';
import Sheet from './Sheet.jsx';


const DEFAULT_STATISTICS = [
	{
		name: 'darwin-evolution',
		values: [
			{ x: 0, y: 0 }
		]
	}
];

const DEFAULT_STATE = {
	/**
	 * @description App state
	 */
	working: false,
	paused: false,

	/**
	 * @description Used to draw Music Scores 
	 */
	selected: null,


	/**
	 * @description Old population holder for single evolution 
	 * @deprecated
	 * @type {{ content: number[], fitness: { value: number, full: { [key: string]: number } }}[]
	 */
	population: [],

	/**
	 * @description Populations hash for evolutions
	 * @type { { [evolutionName: string]: { content: number[], fitness: { value: number, full: { [key: string]: number } } }[] }
	 */
	populations: {},

	/**
	 * @type { { name: string, values: { x: number, y: number }[] }[] }
	 */
	statistics: [],


	/**
	 * @description Used with multiple evolutions to display multiple progress bars
	 * @type {{[evolutionName: string]: number}}
	 */
	percentages: {},

	/**
	 * @description Progress
	 */
	percentage: 0,

	/**
	 * @description Best one of all evolutions
	 * @type {{fitness: { value: number }}}
	 */
	best: null
};

export default class Index extends React.Component {
	state = { ...DEFAULT_STATE };
	/**
	 * @type {GARunner}
	 */
	runner = null

	select = (item) => {
		Player.set(item.content);
		this.setState({
			selected: item.content
		});
	}

	run = () => {
		const newState = {
			...DEFAULT_STATE,
			statistics: [
				{
					name: 'darwin-evolution',
					values: [
						{ x: 0, y: 0 }
					]
				}
			],
			working: true
		};

		this.setState(newState);

		if (this.runner) {
			this.runner.destroy();
		}

		this.runner = this._createRunner();
	};

	resume = () => {
		this.setState({
			paused: false
		});
		this.runner && this.runner.resume();
	};

	pause = () => {
		this.setState({
			paused: true
		});
		this.runner && this.runner.pause();
	};

	stop = () => {
		this.runner && this.runner.stop();
	};

	render() {
		const { store } = this.context;

		let scoresPanel = null;
		let progressBar = null;
		let best = null;
		let individualsTable = null;

		if (this.state.population.length) {
			// TODO: create table for each worker, or use different colors for rows?
			individualsTable = (
				<IndividualsTable
					population={this.state.population}
					onSelect={this.select} />
			);
		}
		if (!isEmpty(this.state.populations)) {
			individualsTable = (
				<div>
					{Object.entries(this.state.populations)
						.map(([name, population]) => {
							return (
								<IndividualsTable
									key={name}
									name={name}
									population={population}
									onSelect={this.select} />
							)
						})}
				</div>
			);
		}

		if (this.state.selected) {
			scoresPanel = (
				<Panel header="Scores">
					<Sheet data={this.state.selected} />
				</Panel>
			);
		}

		/**
		 * @deprecated
		 * @description Display progress bar for single evolution
		 */
		if (this.state.percentage) {
			const currentPercent = (this.state.percentage) | 0;
			progressBar = (
				<div className="progress-bar-wrapper">
					<h3>Progress: </h3>
					<ProgressBar now={currentPercent} label={`${currentPercent}%`} />
				</div>
			);
		}
		/**
		 * @description Display progress bar for multiple evolutions
		 */
		if (!isEmpty(this.state.percentages)) {
			progressBar = this._renderProgressBarForEvolutions();
		}

		// Best Guys ProgressBar
		if (this.state.best) {
			const bestValue = (this.state.best.fitness.value * 100) | 0;
			best = (
				<div className="progress-bar-wrapper">
					<h3>Best: </h3>
					<ProgressBar bsStyle="success" now={bestValue} label={`${bestValue}%`} key="1" />
				</div>
			);
		}

		return (
			<Grid fluid>
				<Row>
					<Col sm={8} md={8}>
						{this.state.statistics.length ? <Graph series={this.state.statistics} /> : null}
						{scoresPanel}
						<GAOptions store={store} />
					</Col>
					<Col sm={4} md={4}>
						<Panel header="Population">
							{this._renderButtons()}
							{best}
							{progressBar}
							{individualsTable}
						</Panel>
					</Col>
				</Row>
			</Grid>
		);
	}

	_renderProgressBarForEvolutions() {
		return (
			<div>
				{Object.entries(this.state.percentages)
					.map(([name, percent]) => [name.replace('-evolution', ''), percent | 0])
					.map(([name, percent]) => (
						<div key={name} className="progress-bar-wrapper">
							<h3>Progress ({name}):</h3>
							<ProgressBar now={percent} label={`${percent}%`} />
						</div>
					))}
			</div>
		);
	}

	_renderButtons() {
		return (
			<ButtonGroup>
				{this._renderFirstButton()}
				<Button bsStyle="danger" onClick={this.stop}>
					<span className="glyphicon glyphicon-stop"></span>
				</Button>
			</ButtonGroup>
		);
	}

	_renderFirstButton() {
		const { paused, working } = this.state;

		if (working && !paused) {
			return (
				<Button bsStyle="warning" onClick={this.pause}>
					<span className="glyphicon glyphicon-pause"></span>
				</Button>
			);
		}

		return (
			<Button bsStyle="success" onClick={working ? this.resume : this.run}>
				<span className="glyphicon glyphicon-play"></span>
			</Button>
		);
	}

	_createRunner() {
		const options = this.context.store.getState().GA;

		if (options.options.useEvolutionStrategies) {
			return this._createEvolutionRunner(options);
		} else {
			return this._createDefaultRunner(options);
		}
	}

	_createDefaultRunner(options) {
		const onDone = ({ data: population }) => this.setState({ population, working: false, paused: false }); // onDone back to default state
		const onPause = ({ data: population }) => this.setState({ population });
		const onProgress = ({ percentage, best }) => {
			const statistics = this.state.statistics;

			statistics[0].values.push({
				x: percentage,
				y: (best.fitness.value * 100)
			});

			this.setState({ best, percentage, statistics });
		};
		return new GARunner(options, { onDone, onProgress, onPause });
	}

	_createEvolutionRunner(options) {
		const onDone = ({ id, data: population }) => {
			const { populations } = this.state;
			const name = this._getNameFromId(id);
			this.setState({
				populations: {
					...populations,
					[name]: population
				},
				working: false,
				paused: false
			});
		};
		const onPause = ({ id, data: population }) => {
			const { populations } = this.state;
			const name = this._getNameFromId(id);
			this.setState({
				populations: {
					...populations,
					[name]: population
				}
			});
		};
		const onProgress = ({ id, percentage, best }) => {
			const statistics = this.state.statistics;
			
			const prevBestFitnessValue = this.state.best && this.state.best.fitness.value || 0;
			const currentBestFitnessValue = best.fitness.value;
			const percentages = this.state.percentages;

			const name = this._getNameFromId(id);
			const series = statistics.find(x => x.name === name);
			const item = {
				x: percentage,
				y: (currentBestFitnessValue * 100)
			};

			if (series) {
				series.values.push(item);
			} else {
				statistics.push({
					name,
					values: [
						{
							x: 0,
							y: 0
						},
						item
					]
				});
			}

			const newState = {
				statistics,
				percentages: {
					...percentages,
					[name]: percentage
				}
			};

			if (currentBestFitnessValue > prevBestFitnessValue) {
				newState.best = best;
			}

			this.setState(newState);
		};
		return new GARunner(options, { onDone, onProgress, onPause });
	}

	_getNameFromId(id) {
		return id.split('_')[0];
	}
}
// TODO: redo with react-redux connect later on
Index.contextTypes = {
	store: React.PropTypes.object
};