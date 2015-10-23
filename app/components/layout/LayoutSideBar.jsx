import React from 'react';
//import nav from '../../nav.js';
import { Link } from 'react-router';
import { Col, Nav, NavItem, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class LayoutSideBar extends React.Component {
    render() {

        const navItems = this.props.nav.map(navItem => {
            return (
                <LinkContainer key={navItem.path} to={navItem.path}>
                    <NavItem>{navItem.title}</NavItem>
                </LinkContainer>
            );
        });

        return (
            <Col sm={3} md={2} className="sidebar">
              <Nav className="nav-sidebar">
                {navItems}
              </Nav>
            </Col>
        );
    }
}