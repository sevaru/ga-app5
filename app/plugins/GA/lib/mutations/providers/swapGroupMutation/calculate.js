import { Groups } from '../../../services/Groups';
import { numberUtils, arrayUtils } from '../../../utils.js';

function validateInput(size, groupSize, groupsCount) {
	if ( size < groupSize * groupsCount ) {
		throw new Error(`Invalid groupSize: ${groupSize} or groupsCount: ${groupsCount} for size: ${size}`);
	}
}

function fromPercentToValue(size, percent) {
	return Math.floor(size * percent / 100);
}

function getMaxOffset(size, groupSize) {
	return size % groupSize;
}

function getSwapIndexes(groupsCount, groupsSize) {
	const swapIndexes = arrayUtils.getRandomIndexes(groupsCount * 2, groupsSize);
	const middle = swapIndexes.length / 2;
	return [swapIndexes.slice(0, middle), swapIndexes.slice(middle)];
}

/**
 * @description options.groupSize in percents!
 */
export function calculate(data: Array<number>, options: { groupSize: number, count: number } = { groupSize: 5, count: 2 }) {
	const size = data.length;
	const groupsCount = options.count;
	const groupSize = fromPercentToValue(size, options.groupSize);

	// 1. Validation
	validateInput(size, groupSize, groupsCount);
	
	// 2 Get offset
	const offset = numberUtils.randomBetween(0, getMaxOffset(size, groupSize) + 1);

	// 3. Create groups
	const groups = Groups.create(data, groupSize, offset);

	// 4. Generate random indexes
	const [fromIndexes, toIndexes] = getSwapIndexes(groupsCount, groups.length());

	// 5. Swap indexes in instance
	groups.swap(fromIndexes, toIndexes);

	return groups.toRaw();
}
