import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { calculate as run } from './transposeMutation/calculate';

const initialState = {
	weight: 0.2,
	groupSize: 5,
	count: 2,
	transposeSize: 2
};

const render = 
	({ count, groupSize, transposeSize }, onblur) => (
		<div>
			<SliderControl
	        	defaultValue={count}
	        	onBlur={onblur}
	        	field={'count'} 
	        	title="Count of groups"
				min={1}
				max={10}
				step={1}
	    	/>
	    	<SliderControl
	        	defaultValue={groupSize}
	        	onBlur={onblur}
	        	field={'groupSize'} 
	        	title="Group size in percents"
				min={1}
				max={100}
				step={1}
	    	/>
	    	<SliderControl
	        	defaultValue={transposeSize}
	        	onBlur={onblur}
	        	field={'transposeSize'} 
	        	title="Size of transposition in steps"
				min={1}
				max={7}
				step={1}
	    	/>
    	</div>
	);

export default {
	name: 'transpose-mutation',
	run,
	render,
	getInitialState: () => initialState
};