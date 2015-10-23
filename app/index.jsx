import 'array.prototype.findindex';
import './main.css';
import './components/layout/dashboard.css';

//LIBS
import React from 'react';
import { render } from 'react-dom'
import { Route, DefaultRoute, Link, RouteHandler } from 'react-router';
import Router from 'react-router';

//WRAPPERS
import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';

//APP
import routes from './routes';
import './plugins/all.jsx';

function main() {
	persist(alt, storage, 'app');
	const app = document.createElement('div');
	document.body.appendChild(app);

	render((<Router>{routes}</Router>), app);
}

main();