import React from 'react';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import routes from '../routes';

export const Root = ({ store }) => (
    <Provider store={store}>
        <Router history={hashHistory} routes={routes} />
    </Provider>
);
