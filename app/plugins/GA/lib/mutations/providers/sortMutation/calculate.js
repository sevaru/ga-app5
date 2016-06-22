import { numberUtils } from '../../../utils.js';

export function calculate(data, options) {
	if ( options.count >= data.length ) {
		throw 'To much gens for sort mutation';
	}

	const length = data.length;
	const startIndex = numberUtils.randomBetween(0, length - options.count);
	const endIndex = startIndex + options.count;

	const sorted = data
		.slice(startIndex, endIndex)
		.sort((a, b) => +a - +b);

	return [
		...data.slice(0, startIndex),
		...sorted,
		...data.slice(endIndex)
	];
}
