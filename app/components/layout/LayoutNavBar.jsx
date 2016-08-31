import React from 'react';
import PlayerControls from '../PlayerControls.jsx';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, NavBrand } from 'react-bootstrap';
import { Link } from 'react-router';

export default class LayoutNavBar extends React.Component {
	render() {
		return (
			<Navbar inverse fixedTop toggleNavKey={0}>
				<NavBrand>
					<Link to="#/">
						GENOM
					</Link>
				</NavBrand>
				<PlayerControls />
				{/*
				<Nav right eventKey={0}>
					<NavItem eventKey={1} href="#">Link</NavItem>
					<NavItem eventKey={2} href="#">Link</NavItem>
					<NavDropdown eventKey={3} title="Dropdown" id="collapsible-navbar-dropdown">
						<MenuItem eventKey="1">Action</MenuItem>
						<MenuItem eventKey="2">Another action</MenuItem>
						<MenuItem eventKey="3">Something else here</MenuItem>
						<MenuItem divider />
						<MenuItem eventKey="4">Separated link</MenuItem>
					</NavDropdown>
				</Nav>*/
				}
		  	</Navbar>
		);
	}
}