import React from 'react';
import PlayerControls from '../PlayerControls.jsx';
import { Navbar, NavbarBrand, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { APP_VERSION } from '../../VERSION';
import { resetState } from '../../resetState';

export default class LayoutNavBar extends React.Component {
	render() {
		return (
			<Navbar inverse fixedTop>
				<NavbarBrand>
					<Link to="#/">
						GENOM {APP_VERSION || ''}
					</Link>
				</NavbarBrand>
				<PlayerControls />
				<Button style={{ marginTop: 6 }} onClick={this.onResetState}>Reset state</Button>
		  	</Navbar>
		);
	}

	onResetState = () => resetState();
}