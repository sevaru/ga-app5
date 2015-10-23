import React from 'react';
import { Col } from 'react-bootstrap';

export default class LayoutMain extends React.Component {
	render() {
		return (
			<Col sm={9} md={10} mdOffset={2} smOffset={3} className="main">
				{this.props.children}
			</Col>
		);
	}
}