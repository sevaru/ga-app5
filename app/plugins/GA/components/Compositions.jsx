// 3d Party
import React from 'react';
import { Link } from 'react-router';
import { Input, Button, Grid, Col, Row, Table, Glyphicon } from 'react-bootstrap';

// Plugin
import MusicContext from '../lib/MusicContext.js';

const DEFAULT = 'default';

export default class Compositions extends React.Component {
	constructor(params) {
		super(params);
		this.state = {
			compositions: MusicContext.getAllCompositions(),
			nameRaw: '',
			name: ''
		};
	}
	onNameChange(e) {
		const nameRaw = e.target.value;
		this.setState({ nameRaw });
		this.setState({ name: '' });

		if ( MusicContext.isValidName(nameRaw) ) {
			this.setState({ name: nameRaw });
		}
	}
	remove(item) {
		MusicContext.remove(item);
		this.setState({
			compositions: MusicContext.getAllCompositions()
		});
	}
	renderCompositionItem(item) {
		return (
			<tr key={item}>
				<td>
					<Link to={`/compositions/${item}`}>
						{item}
					</Link>
				</td>
				<td>
					{
						item !== DEFAULT ? 
						(
							<Button bsStyle="danger" onClick={this.remove.bind(this, item)}>
								<Glyphicon glyph="remove" />
							</Button>
						) : null
					}
				</td>
			</tr>
		);
	}
	render() {
		return (
			<Grid fluid>
				<h2>Compositions</h2>
				<Table striped bordered condensed hover>
					<tbody>
						{this.state.compositions.map(this.renderCompositionItem.bind(this))}					
					</tbody>
				</Table>
				<h2>New</h2>
				<Input type="text" label="Name" onChange={this.onNameChange.bind(this)} value={this.state.nameRaw} />
		 		<Link to={`/compositions/${this.state.name}`} >
				 	<Button bsStyle="info" disabled={!this.state.name}>
			 			New
			 		</Button>
		 		</Link>
			</Grid>
		);
	}
}