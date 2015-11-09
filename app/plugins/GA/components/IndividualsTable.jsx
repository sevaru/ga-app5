import React from 'react';
import { Table } from 'react-bootstrap';

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
						<th>#</th>
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

	renderItem( item, index ) {
		const classes = ( this.state.selectedIndex === index ) ? 'highlight' : '';
		const fitness = item.fitness().toFixed(3);
		return (
			<tr className={classes} key={index} onClick={this.onSelect.bind(this, item, index)}>
				<td>{index}</td>
				<td>{'name' + index}</td>
				<td>{fitness}</td>
			</tr>
		);
	}

	onSelect(item, index) {
		this.setState({
			selectedIndex: index
		});

		console.table(item.content);

		this.props.onSelect(item);
	}
}