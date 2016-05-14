import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { arrayUtils } from '../../utils.js';

const defaultOptions = {
	count: 64
};

function run( data, options = {} ) {
	options = Object.assign({}, defaultOptions, options);

	arrayUtils
		// -1 cause we need neighbor
		.getRandomIndexes(options.count, data.length - 1)
		.forEach(i => {
			const temp = data[i];
			data[i] = data[i + 1];
			data[i + 1] = temp;
		});
	
	return data;
}

const render = 
	(state, onblur) => (
		<SliderControl
        	defaultValue={state.count}
        	onBlur={onblur.bind(null, 'count')}
        	field={'count'} 
        	title="Count of genes"
			min={1}
			max={128}
			step={1}
    	/>
	);

const getInitialState = () => ({
	weight: 0.25,
	count: 32
});

export default {
	name: 'swap2-mutation',
	run,
	render,
	getInitialState
};
