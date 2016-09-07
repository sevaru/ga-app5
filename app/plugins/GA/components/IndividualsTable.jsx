import React from 'react';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import Player from '../../../players/soundfont-player/Player.js';

//TODO:
// Переделать так, чтобы можно было отловить вход новых population
// сейчас componentWillReceiveProps вызывается при каждом клике на таблицу при выделении
// так как под собой это несет this.props.onSelect который меняет state парента и поэтому происходит процесс перерасчета
export default class IndividualsTable extends React.Component {
	constructor(params) {
		super(params);
		this.state = {
			selectedIndex: -1
		};
	}

	render() {
		return (
			<Table striped bordered condensed hover>
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Fitness</th>
					</tr>
				</thead>
				<tbody>
					{this.props.population.map(this.renderItem.bind(this))}
				</tbody>
			</Table>
		);
	}

	renderFitnessInfoItems(items) {
		return items.map(({ key, value, className }) => (
			<tr key={key} className={className}>
				<td>{key}</td>
				<td>{value.toFixed(3)}</td>
			</tr>
		));
	}

	renderFitnessInfo(item) {
		const fitness =
	 		this.renderFitnessInfoItems(
				([
					{ 
						key: 'total',
						className: 'total',
						value: item.fitness.value
					}
				])
				.concat(
					Object
						.keys(item.fitness.full)
						.map(key => ({ key, value: item.fitness.full[key] }))
				)
			);
		return (
			<Table condensed border style={{ marginBottom: 0 }}>
				<tbody>
					{fitness}
				</tbody>
			</Table>
		);
	}

	renderItem( item, index ) {
		const selected = this.state.selectedIndex === index;
		const classes = selected ? 'highlight' : '';
		const fitnessFrag = selected ? this.renderFitnessInfo(item) : item.fitness.value; 

		return (
			<tr className={classes} key={index} onClick={this.onSelect.bind(this, item, index)}>
				<td>
					<ButtonGroup>
						<Button bsStyle="info" onClick={this.play.bind(this, item.content)}>
							<span className="glyphicon glyphicon-play"></span>
						</Button>
						<Button bsStyle="info" onClick={this.stop}>
							<span className="glyphicon glyphicon-stop"></span>
						</Button>
					</ButtonGroup>
				</td>
				<td>{'name' + index}</td>
				<td>
					{fitnessFrag}
				</td>
			</tr>
		);
	}

	play(content) {
		Player.play(content);
	}

	stop = () => {
		Player.stop();
	};

	onSelect(item, index) {
		this.setState({
			selectedIndex: index
		});
		this.props.onSelect(item);
	}
}