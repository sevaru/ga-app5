//libs
import React from 'react';
import { Table, Button, Grid, Col, Row, ButtonGroup, Panel, ProgressBar } from 'react-bootstrap';
import ABCJS from 'ABCJS';

//styles
import styles from './styles.css';

//inner modules
//import GA from './GA.jsx';

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

		this.state = {
			selected: null,
			population: [],
			percentage: 0,
			options: Object.assign({}, DEFAULT_OPTIONS)
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
			percentage: 0
		});

		const runner = new GARunner(
			this.state.options,
				population => { 
				this.setState({ population });
				this.setState({ percentage: 100 });
			},
			percentage => {
				console.log(percentage);
				this.setState({	percentage });
			}
		);

		//runner.destroy();
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
            
		return(
			<Grid fluid>
				<Row>
					<Col sm={8} md={8}>
						<Panel header="Scores">
							<Sheet data={this.state.selected}/>
						</Panel>
						<GAOptions onChange={this.onOptionsChange.bind(this)} options={this.state.options} />
					</Col>
					<Col sm={4} md={4}>
						<Panel header="Population">
							<ButtonGroup>
								<Button bsStyle="primary" onClick={this.run.bind(this)}>Run</Button>
							</ButtonGroup>

							<div className="progress-bar-wrapper">
				                <ProgressBar now={this.state.percentage} label="%(percent)s%" />
				            </div>
							
							{individualsTable}
						</Panel>
					</Col>
				</Row>
			</Grid>
		);
	}
}