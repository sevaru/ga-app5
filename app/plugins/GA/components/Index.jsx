//libs
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import ABCJS from 'ABCJS';

//styles
import styles from './styles.css';

//inner modules
import GA from './GA.jsx';
import Player from '../../../players/soundfont-player/Player.js';

//Components
import Sheet from './Sheet.jsx';
import Options from './Options.jsx';
import IndividualsTable from './IndividualsTable.jsx';

export default class Index extends React.Component { 
	constructor(params) {
		super(params);

		this.state = {
			selected: null,
			population: [],
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
			population: []
		});
		
		let population = GA.run();

		this.setState({
			population
		});
	}
	render() {
		return(
			<Grid fluid>
				<Row>
					<Col sm={8} md={8}>
						<Panel header="Scores">
							<Sheet data={this.state.selected}/>
						</Panel>
						{GA.renderAllOptions()}
					</Col>
					<Col sm={4} md={4}>
						<Panel header="Population">
							<ButtonGroup>
								<Button bsStyle="primary" onClick={this.run.bind(this)}>Run</Button>
							</ButtonGroup>

							<IndividualsTable population={this.state.population} onSelect={this.select.bind(this)} />
						</Panel>
					</Col>
				</Row>
			</Grid>
		);
	}
}