import React from 'react';
import { Col, Nav, NavItem } from 'react-bootstrap';

export default class LayoutSideBar extends React.Component {
    render() {
        return (
            <Col sm={3} md={2} className="sidebar">
              <Nav className="nav-sidebar">
                <NavItem>Overwiew</NavItem>
                <NavItem>Overwiew 1</NavItem>
                <NavItem>Overwiew 2</NavItem>
              </Nav>
            </Col>
        );
    }
}