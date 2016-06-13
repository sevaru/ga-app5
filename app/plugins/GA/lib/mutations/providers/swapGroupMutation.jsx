import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { calculate as run } from './swapGroupMutation/calculate';
import MusicContext from '../../MusicContext';

const COUNT_OF_GENS = MusicContext.getCompositionLength();

const render = 
	(state, onblur) => (
		<SliderControl
        	defaultValue={state.count}
        	onBlur={onblur.bind(null, 'count')}
        	field={'count'} 
        	title="Count of genes"
			min={1}
			max={COUNT_OF_GENS}
			step={1}
    	/>
	);

const getInitialState = () => ({
	weight: 1,
	count: 10
});

export default {
	name: 'swap-group-mutation',
	run,
	render,
	getInitialState
};
