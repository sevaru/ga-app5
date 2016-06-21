import { Groups } from './Groups';
import { numberUtils } from '../utils.js';

function getMaxOffset(size, groupSize) {
	return size % groupSize;
}

export function createGroupsWithRandomOffset(data, groupSize) {
	const maxOffset = getMaxOffset(data.length, groupSize);
	const offset = numberUtils.randomBetween(0, maxOffset + 1);
	return new Groups(data, groupSize, offset);
}