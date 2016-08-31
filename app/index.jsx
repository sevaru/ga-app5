import 'array.prototype.findindex';
import './main.css';
import './styles/dashboard.css';
import './polyfills';

//LIBS
import React from 'react';
import { render } from 'react-dom'
import Router, { Route, DefaultRoute, Link, RouteHandler } from 'react-router';
import { throttle } from 'lodash';

//APP
import './plugins/all.jsx';
import Root from './containers/root';
import configureStore from './store/configureStore'
import initialState from './store/initialState';
import { storage } from './store/persistStorage';

const STATE_KEY = '__APP_STATE__';
// TODO: add migrations;
const store = configureStore(storage.get(STATE_KEY) || initialState);

store.subscribe(
	throttle(() =>
		storage.set(STATE_KEY, store.getState()), 1000));

render(
	<Root store={store} />,
	document.getElementById('root')
);
