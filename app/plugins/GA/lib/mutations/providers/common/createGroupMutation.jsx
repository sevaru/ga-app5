import React from 'react';
import { SliderControl } from '../../../../components/UIFactory.jsx';
import { createGroupsWithRandomOffset } from '../../../services/createGroupsWithRandomOffset';
import { validateGroupsInput, fromPercentToValue, getGroupsIndexes } from '../common.js';

/**
 * @description options.groupSize in percents!
 */
export const createCalculate = (fn) => 
	(data: Array<number>, options: { groupSize: number, count: number }) => {
		const size = data.length;
		const groupsCount = options.count;
		const groupSize = fromPercentToValue(size, options.groupSize);

		// 1. Validation
		validateGroupsInput(size, groupSize, groupsCount);
		
		// 2. Create groups
		const groups = createGroupsWithRandomOffset(data, groupSize);

		// 3. Generate random indexes
		const [fromIndexes, toIndexes] = getGroupsIndexes(groupsCount, groups.length());

		// 4. Do something with indexes and group
		fn(groups, [fromIndexes, toIndexes], options);		

		return groups.toRaw();
	};


const render = 
	({ count, groupSize }, onblur) => (
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
    	</div>
	);

const initialState = {
	weight: 0.2,
	groupSize: 5,
	count: 2
};

export function createGroupMutation(name, fn, state = initialState) {
	return {
		name,
		run: createCalculate(fn),
		render,
		getInitialState: () => state
	};
}
