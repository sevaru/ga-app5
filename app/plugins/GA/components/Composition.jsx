// 3d Party
import React from 'react';
import { FormControl, Button, Grid, Col, Row } from 'react-bootstrap';

// Framework
import Player from '../../../players/soundfont-player/Player.js';

// Plugin
import MusicContext, { availableValuesInGF } from '../lib/MusicContext.js';

// Local
import Sheet from './Sheet.jsx';

const DEFAULT = 'default';

export default class Composition extends React.Component {
	constructor(params) {
		super(params);

		const composition = MusicContext.getByKey(this.props.params.composition) || null;

		this.state = {
			compositionRaw: composition ? this.compositionToString(composition) : '',
			composition,
			invalidName: true,
			invalidComposition: false,
			isDefault: (this.props.params.composition === DEFAULT)
		};
	}

	_convert( raw ) {
		let rawArray = raw.split(' ');

		rawArray = rawArray.map(item => Number(item));

		if ( 
			rawArray.some(item => {
				return (
					isNaN(item) ||
			 		(availableValuesInGF.indexOf(item) === -1)
				);
			})
		) {
			return null;
		}

		return rawArray;
	}

	compositionToString(array) {
		return array && array.join(' ') || '';
	}

	save() {
		const composition = this.state.composition;
		const name = this.props.params.composition;
		MusicContext.save(name, composition);
	}

	onChange(e) {
		const composition = e.target.value;
		const converted = this._convert(e.target.value);

		this.setState({
			compositionRaw: composition
		});

		if ( converted ) {
			Player.set(converted);
			this.setState({
				composition: converted,
				invalidComposition: false
			});
		} else {
			this.setState({
				invalidComposition: true
			});
		}
	}

	render() {
		const compositionKey = this.props.params.composition;

		return (
			<Grid fluid>
				<h3>{compositionKey}</h3>
				<Row>
					<Col sm={4} md={4}>
					 	<FormControl componentClass="textarea" style={{ height: 230 }} label="Notes" onChange={this.onChange.bind(this)} value={this.state.compositionRaw} />
				 		<Button disabled={this.state.isDefault || this.state.invalidComposition} bsStyle="success" onClick={this.save.bind(this)}>Save</Button>
					</Col>
					<Col sm={4} md={4}>
						<Sheet data={this.state.composition} />
					</Col>
				</Row>
			</Grid>
		);
	}		
}