//libs
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel, ProgressBar } from 'react-bootstrap';
import { LineChart } from 'react-d3';
import ABCJS from 'ABCJS';

//styles
import styles from './styles.css';

import Player from '../../../players/soundfont-player/Player.js';
import DEFAULT_OPTIONS from '../plugin/default-options.js';

//Components
import GAOptions from './GAOptions.jsx';
import GARunner from '../plugin/GARunner.js';
import Sheet from './Sheet.jsx';
import IndividualsTable from './IndividualsTable.jsx';

export default class Index extends React.Component { 
	constructor(params) {
		super(params);

		this.runner = null;

		this.state = {
			selected: null,
			population: [],
			percentage: 0,
			best: null,
			options: Object.assign({}, DEFAULT_OPTIONS),
			statistics: []
		};
	}
	
	select( item, index ) {
		Player.set(item.content);
		this.setState({
			selected: item.content
		});
	}

	run() {
		this.setState({
			selected: null,
			population: [],
			statistics: [],
			percentage: 0
		});

		if ( this.runner ) {
			this.runner.destroy();
		}

		this.runner = new GARunner(
			this.state.options,
				population => { 
				this.setState({ population });
			},
			({ percentage, best }) => {
				const statistics = this.state.statistics;

				statistics.push({
					x: percentage,
					y: (best.fitnessValue * 100)
				});

				this.setState({ best, percentage, statistics });
			}
		);
	}

	onOptionsChange(path /*string like mutations.swap2 */, field, value) {
		const options = this.state.options;
		const target = path.split('.').reduce((store, dir) => {
			return store[dir];
		}, options);
		target[field] = value;
		this.setState({ options });
	}

	render() {
		const style = {
            marginTop: '10px'
        };

        const individualsTable = this.state.population.length ? <IndividualsTable population={this.state.population} onSelect={this.select.bind(this)} /> : null;
        let scoresPanel = null;
        let progressBar = null;
        let best = null;

        // Panels
        if ( this.state.selected ) {
        	scoresPanel = (
        		<Panel header="Scores">
					<Sheet data={this.state.selected}/>
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

        if ( this.state.best ) {
        	best = (
        		<div className="progress-bar-wrapper">
        			<h3>Best: </h3>
	                <ProgressBar bsStyle="success" now={(this.state.best.fitnessValue * 100)|0} label="%(percent)s%" key="1" />
	            </div>
    		);
        }

        const viewBoxObject = {
		    x: 0,
		    y: 0,
		    width: 500,
		    height: 400
		};

		const lineChart = (this.state.statistics && this.state.statistics.length) ? (
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
		) : null;

		return (
			<Grid fluid>
				<Row>
					<Col sm={8} md={8}>
						{lineChart}
						{scoresPanel}
						<GAOptions onChange={this.onOptionsChange.bind(this)} options={this.state.options} />
					</Col>
					<Col sm={4} md={4}>
						<Panel header="Population">
							<ButtonGroup>
								<Button bsStyle="primary" onClick={this.run.bind(this)}>Run</Button>
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
				strokeDashArray: '5,5',
			}
		];
	}
}