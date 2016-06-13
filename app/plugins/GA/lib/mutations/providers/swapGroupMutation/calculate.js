import { numberUtils } from '../../../utils.js';

/**
 * @description If [true, true] than returns array where only one item us true
 */
function normalizeGroupPositionInfo(couldBe) {
	if ( couldBe.every(x => x) ) {
		const indexInCouldBe = numberUtils.randomBetween(0, 2);

		if (indexInCouldBe === 0) {
			couldBe = [true, false];
		} else if (indexInCouldBe === 1)  {
			couldBe = [false, true];
		} else {
			throw 'What???';
		}
	}

	return couldBe;
}
function validateInput(options, length) {
	if ( options.count >= length / 2 ) {
		throw 'To much gens for swapGroup mutation';
	}
}
/**
 * @description Put indexes with lowest values at the beginning
 */
function normalizeOrder(indexes) {
	if (indexes[0][0] > indexes[1][0]) {
		return [indexes[1], indexes[0]];
	}
	return indexes;
}
function getFirstGroupIndexes(indexes, length, count) {
	const result = [
		numberUtils.randomBetween(0, length)
	];
	result[1] = result[0] + count - 1;
	return result;
}
function swapParts(data, indexes, length) {
	return [
		// Pre part
		...data.slice(0, indexes[0][0]),

		// Swapped part
		...data.slice(indexes[1][0], indexes[1][1] + 1),

		// Between 1 and 2
		...data.slice(indexes[0][1] + 1, indexes[1][0]),

		// Swapped part 2
		...data.slice(indexes[0][0], indexes[0][1] + 1),

		...data.slice(indexes[1][1] + 1, length)
	];
}

/**
 * @return {Tuple<boolean, boolean>} 
 * [0] - group could be at the left side, [1] - group could be at the right side
 */
function secondGroupPositionInfo(indexes, count, length) {
	const result = [false, false];

	// 1. At start ?
	if ( indexes[0][0] - count >= 0 ) {
		result[0] = true;
	}

	// 2. At end ?
	if ( (indexes[0][1] + count) <= (length - 1) ) {
		result[1] = true;
	}

	if (result.every(x => !x)) {
		return null;
	}

	return normalizeGroupPositionInfo(result);	
}

function getSecondGroupIndexes(couldBe, indexes, count, length) {
	const result = [];

	// Start
	if ( couldBe[0] ) {
		result[0] = numberUtils.randomBetween(0, indexes[0][0] - count);
	// End
	} else {
		result[0] = numberUtils.randomBetween(indexes[0][1] + 1, length - count);
	}

	result[1] = result[0] + count - 1;
	return result;
}

export function calculate(data, options = { count: 3 }) {
	const length = data.length;
	const count = options.count;

	// 1. Validation
	validateInput(options, length);
	
	const indexes = [
		getFirstGroupIndexes(indexes, length, count)
	];
	
	while (1) {
		const couldBe = secondGroupPositionInfo(indexes, count, length);
		if ( !couldBe ) {
			continue;
		}
		indexes[1] = getSecondGroupIndexes(couldBe, indexes, count, length);
		break;
	}

	return swapParts(data, normalizeOrder(indexes), length);
}
