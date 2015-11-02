import styles from './styles.css';
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import ABCJS from 'ABCJS';
import GA from '../plugin/GA';
import convertToABC from '../plugin/utils/convertToABC';
import Sheet from './Sheet.jsx';
import Options from './Options.jsx';
import {PlayerSource} from '../../../components/PlayerControls.jsx';

const GA_CONFIG = {
	deathLimit: 0.2,
    count: 25,
	threshold: 0.8, /* End processing when someone near good (best 1) */
    maxIterations: 500,
    mutationProbability: 0.7,
    useRandomInitialIndividuals: true,
    countOfBestToLiveThrought: 4
};

export default class Index extends React.Component { 
	constructor(params) {
		super(params);
		this.run = this.run.bind(this);
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.renderTableItem = this.renderTableItem.bind(this);
		this.select = this.select.bind(this);

		this._settings = GA_CONFIG;

		this.state = {
			selected: null,
			selectedIndex: -1,
			progress: 0,
			population: [],
		};
	}
	render() {
		return(
			<Grid fluid>
				<Row>
					<Col sm={8} md={8}>
						<Panel header="Scores">
							<Sheet abc={this.state.selected}/>
						</Panel>

						<Panel header="Options">
							<Options settings={this._settings} onChange={this.onOptionsChange.bind(this)} />
						</Panel>
					</Col>
					<Col sm={4} md={4}>
						<Panel header="Population">
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
			</Grid>
		);
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
		PlayerSource.setInternalFormat(item.content);
		this.setState({
			selectedIndex: index,
			selected: convertToABC(item.content)
		});
	}
	run() {
		let ga = new GA(this._settings);
		let population = ga.run();

		this.setState({
			selected: null,
			selectedIndex: -1,
			population
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
	onOptionsChange(settings) {
		this._settings = settings;
	}
}