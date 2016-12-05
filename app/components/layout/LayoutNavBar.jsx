import React from 'react';
import PlayerControls from '../PlayerControls.jsx';
import { Navbar, NavbarBrand } from 'react-bootstrap';
import { Link } from 'react-router';
import { APP_VERSION } from '../../VERSION';

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
		  	</Navbar>
		);
	}
}