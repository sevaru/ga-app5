import 'array.prototype.findindex';
import './main.css';
import './components/layout/dashboard.css';

import React from 'react';
import App from './components/App.jsx';
import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';

function main() {
	persist(alt, storage, 'app')
	const app = document.createElement('div');
	document.body.appendChild(app);
	React.render(<App />, app);
}

main();