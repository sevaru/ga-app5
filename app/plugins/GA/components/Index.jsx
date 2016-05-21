//styles
import styles from './styles.css';

//libs
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel, ProgressBar } from 'react-bootstrap';
import { LineChart } from 'react-d3';
import ABCJS from 'ABCJS';
import {connect} from 'react-redux';

import Player from '../../../players/soundfont-player/Player.js';

//Components
import GAOptions from './GAOptions.jsx';
import GARunner from '../lib/ga/GARunner.js';
import Sheet from './Sheet.jsx';
import IndividualsTable from './IndividualsTable.jsx';

const DEFAULT_STATE = {
	working: false, // calculate process is execution
	paused: false,
	selected: null,
	population: [],
	statistics: [],
	percentage: 0,
	best: null	
};

// TODO: read crossover options from redux state
export default class Index extends React.Component { 
	constructor(params, context) {
		super(params);
		this.runner = null;

		const state = context.store.getState();

		// TODO: put options state in namespace? or grab it from?
		this.state = Object.assign(
			{},
			DEFAULT_STATE,
			// TODO: why i put this in state?
			{
				crossover: state.GA.crossover,
				mutation: state.GA.mutation,
				options: state.GA.options
		 	}
		);
	}
	
	select( item, index ) {
		Player.set(item.content);
		this.setState({
			selected: item.content
		});
	}

	run() {
		// Update UI with default values
		this.setState({
			working: true,
			selected: null,
			population: [],
			statistics: [],
			best: 0,
			percentage: 0
		});

		// Delete old runner if it is
		if ( this.runner ) {
			this.runner.destroy();
		}

		// New Runner
		const onDone = population => this.setState({ population, working: false, paused: false }); // onDone back to default state
		const onPause = population => this.setState({ population });
		const onProgress = ({ percentage, best }) => {
			const statistics = this.state.statistics;

			statistics.push({
				x: percentage,
				y: (best.fitnessValue * 100)
			});

			this.setState({ best, percentage, statistics });
		};

		const options = this.context.store.getState().GA;
		this.runner = new GARunner(options, onDone, onProgress, onPause);
	}

	resume() {
		this.setState({
			paused: false
		});
		this.runner && this.runner.resume();
	}

	pause() {
		this.setState({
			paused: true
		})
		this.runner && this.runner.pause();
	}

	stop() {
		this.runner && this.runner.stop();
	}

	render() {
		const {store} = this.context;
		const style = {
            marginTop: '10px'
        };
        const {paused, working} = this.state;

        let scoresPanel = null;
        let progressBar = null;
        let lineChart = null;
        let best = null;
        let individualsTable = null;

        if ( this.state.population.length ) {
        	individualsTable = (
        		<IndividualsTable
        			population={this.state.population}
        			onSelect={this.select.bind(this)} />
    		);
        }

        // Panels
        if ( this.state.selected ) {
        	scoresPanel = (
        		<Panel header="Scores">
					<Sheet data={this.state.selected} />
				</Panel>
    		);
        }

        // ProgressBar
        if ( this.state.percentage ) {
        	progressBar = (
        		<div className="progress-bar-wrapper">
        			<h3>Progress: </h3>
	                <ProgressBar now={(this.state.percentage)|0} label="%(percent)s%" />
	            </div>
    		);
        }

        // Best Guys ProgressBar
        if ( this.state.best ) {
        	best = (
        		<div className="progress-bar-wrapper">
        			<h3>Best: </h3>
	                <ProgressBar bsStyle="success" now={(this.state.best.fitnessValue * 100)|0} label="%(percent)s%" key="1" />
	            </div>
    		);
        }

        // Graph of Progress
		if ( this.state.statistics && this.state.statistics.length ) {
			const viewBoxObject = {
			    x: 0,
			    y: 0,
			    width: 500,
			    height: 400
			};
			lineChart = (
				<Panel header="Graph">
					<LineChart
					  legend={true}
					  data={this._createLineChartData(this.state.statistics)}
					  width={800}
					  height={400}
					  viewBoxObject={viewBoxObject}
					  title="Line Chart"
					  yAxisLabel="Altitude"
					  xAxisLabel="Elapsed Time (sec)"
					  gridHorizontal={true}
					></LineChart>
				</Panel>
			);
		}

		return (
			<Grid fluid>
				<Row>
					<Col sm={8} md={8}>
						{lineChart}
						{scoresPanel}
						<GAOptions store={store} />
					</Col>
					<Col sm={4} md={4}>
						<Panel header="Population">
							{/* extract to <GACalculationControls play pause resume stop working paused>*/}
							<ButtonGroup>
								{
									working ?
									(
										paused ?
										(
											<Button bsStyle="success" onClick={this.resume.bind(this)}>
												<span className="glyphicon glyphicon-play"></span>
											</Button>
										):
										(
											<Button bsStyle="warning" onClick={this.pause.bind(this)}>
												<span className="glyphicon glyphicon-pause"></span>
											</Button>
										)
									) :
									(
										<Button bsStyle="success" onClick={this.run.bind(this)}>
											<span className="glyphicon glyphicon-play"></span>
										</Button>
									)
								}
								<Button bsStyle="danger" onClick={this.stop.bind(this)}>
									<span className="glyphicon glyphicon-stop"></span>
								</Button>
							</ButtonGroup>
							{best}
							{progressBar}
							{individualsTable}
						</Panel>
					</Col>
				</Row>
			</Grid>
		);
	}

	// TODO: move to separate module wrapper on linechart
	_createLineChartData(data) {
		return [
			{
				name: 'series1',
				values: data,
				strokeWidth: 3,
				strokeDashArray: '5,5'
			}
		];
	}
}
// TODO: redo with react-redux connect later on
Index.contextTypes = {
	store: React.PropTypes.object
};