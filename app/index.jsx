import 'array.prototype.findindex';
import './main.css';
import './styles/dashboard.css';

//LIBS
import React from 'react';
import { render } from 'react-dom'
import { Route, DefaultRoute, Link, RouteHandler } from 'react-router';
import Router from 'react-router';


//APP
import './plugins/all.jsx';
import Root from './containers/root';
import configureStore from './store/configureStore'
import initialState from './store/initialState';

console.log(initialState);
const store = configureStore(initialState);

window.store = store;

render(
	<Root store={store} />,
	document.getElementById('root')
);

