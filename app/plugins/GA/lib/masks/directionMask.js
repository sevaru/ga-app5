import '../../../../polyfills'; // For Object.entries in jest tests
import { max } from 'lodash';
import { PAUSE, HOLD } from '../MusicContext';
import { maskFactory } from './helpers';

export const DIRECTION = {
	UP: 'UP',
	DOWN: 'DOWN',
	STABLE: 'STABLE',
	NONE: 'NONE'
};

const DEFAULT_SIZE = 3;
const MIN_SPREAD = 3;

function getDirection(a, b) {
	if (a === b) {
		return DIRECTION.STABLE;
	}
	return a > b ? DIRECTION.DOWN : DIRECTION.UP;
}

function calculateFrequencies(bar, { size }) {
	const storage = {
		[DIRECTION.UP]: 0,
		[DIRECTION.DOWN]: 0,
		[DIRECTION.STABLE]: 0,
		[DIRECTION.NONE]: 0
	};
	// Dummy implementation need rework
	let chain = [];
	let currentDirection = null;
	for (let i = 0; i < bar.length; i++) {
		const value = bar[i];
		if (value === PAUSE) {
			if (chain.length >= size) {
				storage[currentDirection || DIRECTION.NONE] += 1;
			}
			chain = [];
			currentDirection = null;
			continue;
		}

		if (!chain.length) {
			chain.push(value);
			continue;
		}

		const prev = chain[chain.length - 1];
		const direction = getDirection(prev, value);

		if (!currentDirection) {
			currentDirection = direction;
			chain.push(value);
			continue;
		}

		if (currentDirection === direction) {
			chain.push(value);
		} else {
			if (chain.length > size) {
				storage[currentDirection || DIRECTION.NONE] += 1;
			}
			chain = [value];
			currentDirection = null;
			continue;
		}
	}
	if (chain.length >= size) {
		storage[currentDirection || DIRECTION.NONE] += 1;
	}
	return storage;
}

/**
 * @desc exported for tests
 */
export function directionForBar(bar, { size = DEFAULT_SIZE, spread = MIN_SPREAD } = {}) {
	const cleanedBar =
		bar.reduce((reducer, current) =>
			current === HOLD ?
				reducer :
				[...reducer, current], []);

	const frequencies = calculateFrequencies(cleanedBar, { size, spread });

	const descSortedFrequencies =
 		Object
			.entries(frequencies)
			.sort((a, b) => a[1] < b[1]);

	const [first, second] = descSortedFrequencies;

	if (first[1] - second[1] >= spread) {
		return first[0];
	} else {
		return DIRECTION.NONE;
	}
}

/**
 * @type {Array<number>}
 * @return {Array<DIRECTION>}
 */
export const directionAnalyzer = maskFactory(directionForBar);
