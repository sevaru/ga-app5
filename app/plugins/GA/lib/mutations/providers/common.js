import { arrayUtils } from '../../utils.js';

export function validateGroupsInput(size, groupSize, groupsCount) {
	if ( size < groupSize * groupsCount ) {
		throw new Error(`Invalid groupSize: ${groupSize} or groupsCount: ${groupsCount} for size: ${size}`);
	}
}

export function fromPercentToValue(size, percent) {
	return Math.floor(size * percent / 100);
}

/**
 * returns 2 groups of indexes 
 */
export function getGroupsIndexes(groupsCount, groupsSize) {
	// TODO: [0, groupSize - 1] quick fix to not grab first and last indexes
	const swapIndexes = arrayUtils.getRandomIndexes(groupsCount * 2, groupsSize, [0, groupsSize - 1]);
	const middle = swapIndexes.length / 2;
	return [swapIndexes.slice(0, middle), swapIndexes.slice(middle)];
}
