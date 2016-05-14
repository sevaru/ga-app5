import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { arrayUtils } from '../../utils.js';

const defaultOptions = {
	count: 64
};

const UP_CORNER = 14;
const DOWN_CORNER = 1;

class UpAndDownMutation {
	mutate( data, options = {} ) {
		options = Object.assign({}, defaultOptions, options);
		const indexes = arrayUtils.getRandomIndexes(options.count, data.length);
		indexes.forEach(i => {
			if ( data[i] === -1 || data[i] === 0 ) {
				return;
			} 
			data[i] = this._mutateOne(data[i]);
		});
		return data;
	}
	_mutateOne( value ) {
		if ( Math.random() > 0.5 ) {
			//TODO: export to common END
			if ( value < UP_CORNER ) {
				return value + 1;
			}

			return value;
		} else {
			//TODO: export to common START
			if ( value > (DOWN_CORNER + 1)  ) {
				return value - 1;
			}

			return value;
		}
	}
}


const instance = new UpAndDownMutation();
const run = instance.mutate.bind(instance);

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
	weight: 1,
	count: 7
});

export default {
	name: 'up-and-down-mutation',
	run,
	render,
	getInitialState
};
