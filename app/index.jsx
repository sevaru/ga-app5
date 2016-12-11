import 'array.prototype.findindex';
import './main.css';
import './styles/dashboard.css';
import './polyfills';

//LIBS
import React from 'react';
import { render } from 'react-dom';
import { throttle } from 'lodash';

//APP
import './plugins/all.jsx';
import { APP_VERSION, VERSION_KEY, STATE_KEY } from './VERSION';
import { Root } from './containers/root';
import configureStore from './store/configureStore';
import initialState from './store/initialState';
import { storage } from './store/persistStorage';

function migrate(persistedState, currentState) {
	if (persistedState && storage.get(VERSION_KEY) === APP_VERSION) {
		return persistedState;
	}
	storage.set(VERSION_KEY, APP_VERSION);
	return currentState;
}

// TODO: add migrations;
const store = configureStore(migrate(storage.get(STATE_KEY), initialState));

store.subscribe(
	throttle(() =>
		storage.set(STATE_KEY, store.getState()), 1000));

render(
	<Root store={store} />,
	document.getElementById('root')
);
