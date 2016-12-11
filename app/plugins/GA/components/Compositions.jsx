// 3d Party
import React from 'react';
import { Link } from 'react-router';
import { FormControl, Button, ButtonGroup, Grid, Table, Glyphicon } from 'react-bootstrap';

// Plugin
import MusicContext from '../lib/MusicContext.js';

const DEFAULT = 'default';

export default class Compositions extends React.Component {
	constructor(params) {
		super(params);
		this.state = {
			compositions: MusicContext.getAllCompositions(),
			nameRaw: '',
			name: '',
			currentKey: MusicContext.getCurrentKey()
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
	select = (item) => {
		MusicContext.selectComposition(item);
		this.setState({
			currentKey: item
		});
	};
	renderCompositionItem(item) {
		return (
			<tr key={item} className={item === this.state.currentKey ? 'selected' : ''}>
				<td>
					<Link to={`/compositions/${item}`}>
						{item}
					</Link>
				</td>
				<td>
					{
						item !== DEFAULT ? 
						(
							<ButtonGroup>
								<Button bsStyle="info" onClick={() => this.select(item)}>
									<Glyphicon glyph="ok-sign" />
								</Button>
								<Button bsStyle="danger" onClick={this.remove.bind(this, item)}>
									<Glyphicon glyph="remove" />
								</Button>
							</ButtonGroup>
						) : 
						(
							<Button bsStyle="info" onClick={() => this.select(item)}>
								<Glyphicon glyph="ok-sign" />
							</Button>
						)
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
				<FormControl type="text" label="Name" onChange={this.onNameChange.bind(this)} value={this.state.nameRaw} />
		 		<Link to={`/compositions/${this.state.name}`} >
				 	<Button bsStyle="info" disabled={!this.state.name}>
			 			New
			 		</Button>
		 		</Link>
			</Grid>
		);
	}
}