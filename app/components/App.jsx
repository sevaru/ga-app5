import React from 'react';
import { RouteHandler } from 'react-router';

import nav from '../nav.js';

import { Grid, Row, Col } from 'react-bootstrap';
import LayoutNavBar from './layout/LayoutNavBar.jsx';
import LayoutSideBar from './layout/LayoutSideBar.jsx';
import LayoutMain from './layout/LayoutMain.jsx';
import Home from './layout/Home.jsx';


import Index from '../plugins/GA/components/Index';

export default class App extends React.Component {
	render() {
		return (
			<div>
				<LayoutNavBar />
				<Grid fluid>
					<Row>
						<LayoutSideBar nav={nav} />
						<LayoutMain>
							{this.props.children || <Index />}
						</LayoutMain>
					</Row>
				</Grid>
			</div>
		);
	}
}