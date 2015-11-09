import React from 'react';
import { RouteHandler } from 'react-router';

/*import Lanes from './Lanes.jsx';
import AltContainer from 'alt/AltContainer';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
*/
import nav from '../nav.js';

import { Grid, Row, Col } from 'react-bootstrap';
import LayoutNavBar from './layout/LayoutNavBar.jsx';
import LayoutSideBar from './layout/LayoutSideBar.jsx';
import LayoutMain from './layout/LayoutMain.jsx';
import Home from './layout/Home.jsx';


//@DragDropContext(HTML5Backend)
export default class App extends React.Component {
	render() {
		//const notes = this.props.notes;
		return (
			<div>
				<LayoutNavBar />
				<Grid fluid>
					<Row>
						<LayoutSideBar nav={nav} />
						<LayoutMain>
							{this.props.children || <Home />}
						</LayoutMain>
					</Row>
				</Grid>
			</div>


			/*<div>
				<button className="add-note" onClick={this.addItem}>+</button>
				<AltContainer
					stores={[LaneStore]}
					inject={
						{ items: () => LaneStore.getState().lanes || [] }
					}
				>
					<Lanes />
				</AltContainer>
			</div>*/
		);
	}
	addItem() {
		console.log('addItem');
		LaneActions.create({ name: 'New Lane' });
	}
}