import styles from './styles.css';
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import ABCJS from 'ABCJS';
import GA from '../plugin/GA';
import convert from '../plugin/utils/convert';
import Player from '../plugin/utils/Player';
import Sheet from './Sheet.jsx';

const GA_CONFIG = {
	deathLimit: 0.3,
    count: 25,
	threshold: 0.8, /* End processing when someone near good (best 1) */
    maxIterations: 2000,
    mutationProbability: 0.7,
    useRandomInitialIndividuals: true,
    countOfBestToLiveThrought: 4
};

//TODO: set selected in grid
export default class Index extends React.Component { 
	constructor(params) {
		super(params);
		this.run = this.run.bind(this);
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.renderTableItem = this.renderTableItem.bind(this);
		this.select = this.select.bind(this);

		this.state = {
			selected: null,
			selectedIndex: -1,
			population: []
		};
	}
	render() {
		return(
			<Grid fluid>
				<Row>
					<Col sm={6} md={6}>
						<Panel header="Panel heading without title">
							<ButtonGroup>
								<Button bsStyle="success" onClick={this.play}>Play</Button>
								<Button bsStyle="danger" onClick={this.stop}>Stop</Button>
							</ButtonGroup>
							<Sheet abc={this.state.selected}/>
						</Panel>
					</Col>
					<Col sm={6} md={6}>
						<Panel header="Panel heading without title">
							<ButtonGroup>
								<Button bsStyle="primary" onClick={this.run}>Run</Button>
							</ButtonGroup>
							<Table striped bordered condensed hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Name</th>
										<th>Fitness</th>
									</tr>
								</thead>
								<tbody>
									{this.state.population.map(this.renderTableItem)}
								</tbody>
							</Table>
						</Panel>
					</Col>
				</Row>
				<Row>
					<Col sm={12} md={12}>
						<Panel header="Panel heading without title">
							Panel content
						</Panel>
					</Col>
				</Row>
			</Grid>
		);
	}
	onSliderChange(event) {
		console.log(event.target.value);		
	}
	renderTableItem( item, index ) {
		const classes = ( this.state.selectedIndex === index ) ? 'highlight' : '';
		return (
			<tr className={classes} key={index} onClick={this.select.bind(null, item, index)}>
				<td>{index}</td>
				<td>{'name' + index}</td>
				<td>{item.fitness()}</td>
			</tr>
		);
	}
	select( item, index ) {
		this.setState({
			selectedIndex: index,
			selected: convert(item.content)
		});
	}
	run() {
		let ga = new GA(GA_CONFIG);
		let population = ga.run();

		window['a'] = population;

		this.setState({
			population: population
		});
	}
	play() {
		Player.stop();
		
		const selectedIndex = this.state.selectedIndex;
		if ( selectedIndex === -1 ) {
			return;
		}
		const selected = this.state.population[selectedIndex];

		Player.play(selected.content);
	}
	stop() {
		Player.stop();
	}
}