import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { arrayUtils } from '../../utils.js';
import MusicContext from '../../MusicContext';

function run( data, { percents } ) {
	const availableValues = MusicContext.getAvailableValues();
	const length = data.length;
	const count = Math.floor(length * percents / 100);

	return arrayUtils
		.getRandomIndexes(count, length)
		.reduce((store, index) => {
			store[index] = arrayUtils.randomElement(availableValues);
			return store;			
		}, data.slice());
}

const render = 
	(state, onblur) => (
		<SliderControl
        	defaultValue={state.percents}
        	onBlur={onblur.bind(null, 'percents')}
        	field={'percents'} 
        	title="Percents"
			min={1}
			max={50}
			step={1}
    	/>
	);

const getInitialState = () => ({
	weight: 0.25,
	percents: 5
});

export default {
	name: 'random-mutation',
	run,
	render,
	getInitialState
};
