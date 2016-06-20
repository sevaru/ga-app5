import React from 'react';
import { SliderControl } from '../../../components/UIFactory.jsx';
import { calculate as run } from './swapGroupMutation/calculate';

const render = 
	(state, onblur) => {
		return (
			<div>
				<SliderControl
		        	defaultValue={state.count}
		        	onBlur={onblur}
		        	field={'count'} 
		        	title="Count of groups"
					min={1}
					max={10}
					step={1}
		    	/>
		    	<SliderControl
		        	defaultValue={state.groupSize}
		        	onBlur={onblur}
		        	field={'groupSize'} 
		        	title="Group size in percents"
					min={1}
					max={100}
					step={1}
		    	/>
	    	</div>
		)
	};

const getInitialState = () => ({
	weight: 1,
	count: 4,
	groupSize: 4
});

export default {
	name: 'swap-group-mutation',
	run,
	render,
	getInitialState
};
