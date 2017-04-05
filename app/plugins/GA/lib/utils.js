function checkArray(arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError(`arr should be an array ${arr} given.`);
	}
}

function checkObj(obj) {
	if (!obj || typeof obj !== 'object') {
		throw new TypeError(`obj should be an object ${obj} given`);
	}
}

const numberUtils = {
	/**
	 * @param {number} startIndex
	 * @param {number} endIndex not included
	 * @returns {number}
	 */
	randomBetween(startIndex, endIndex) {
		if (startIndex < 0 || endIndex < 0) {
			throw 'wft randomBetween';
		}
		if (endIndex === undefined) {
			endIndex = startIndex;
			startIndex = 0;
		}

		return Math.floor(Math.random() * endIndex) + startIndex;
	},

	normalizeValue(value, maxValue) {
		if (value <= maxValue) {
			return value;
		}
		const rem = value % maxValue;
		return rem ? rem : maxValue;
	},

	/**
	 * @param {number} value - float or int
	 * @param {{ max: number, min: number }} options
	 * @returns {number}
	 */
	strip(value, { min = 0, max = 1 } = {}) {
		if (value < min) {
			return min;
		}

		if (value >= max) {
			return max;
		}

		return value;
	},

	/**
	 * @param {number} basis
	 * @param {number} percent - from 0 to 1
	 * @param {{min: number, max: number}}
	 */
	fluctuate(basis, percent = 0.2, { min = 0, max = 1 } = {}) {
		const newValue = basis + (percent * Math.random()) * (randomUtils.headsOrTails() ? 1 : -1);
		return numberUtils.strip(newValue, { min, max });
	}
};

export const arrayUtils = {
	last(array) {
		return array[array.length - 1];
	},

	/**
	 * @param {T} value
	 * @param {number} length - int or float
	 * @returns {T[]}
	 */
	make(value, length) {
		// NOTE: length converted to int to prevent infinite loop in while
		length = length | 0;
		let arr = [];
		while (length--) {
			arr[length] = value;
		}
		return arr;
	},

	/**
	 * @param {number} count
	 * @param {number} length
	 * @param {Array<number>} except - except indexes
	 * @returns {Array<number>}
	 */
	getRandomIndexes(count, length, except) {
		const result = [];

		if (count > length) {
			count = length;
		}

		while (count > 0) {
			const newIndex = numberUtils.randomBetween(length);
			if (result.indexOf(newIndex) !== -1) {
				continue;
			}

			if (except && except.includes(newIndex)) {
				continue;
			}

			result.push(newIndex);
			count--;
		}

		return result;
	},

	randomKey(arr) {
		checkArray(arr);
		return numberUtils.randomBetween(arr.length);
	},

	randomElement(arr) {
		const randomKey = arrayUtils.randomKey(arr);
		return arr[randomKey];
	},

	findObjectByKey(array, field, value) {
		return array.find(element => element.hasOwnProperty(field) && element[field] === value);
	}
};

const objectUtils = {
	randomElement(obj) {
		checkObj(obj);
		const keys = Object.keys(obj);
		const randomKey = arrayUtils.randomElement(keys);
		return obj[randomKey];
	}
};

const stringUtils = {
	camelCaseToHuman(str) {
		// \d - any digit 0..9 and other locals
		const reg = /([a-z])([A-Z])/g;
		const template = '$1 $2';
		const splitter = ' ';

		return str
			.replace(reg, template)
			.split(splitter)
			.map(w => stringUtils.firstUpper(w))
			.join(splitter);
	},

	firstUpper(str) {
		return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
	}
}

const selectionUtils = {
	/**
	 * @param {Object} obj
	 * @param {(field: object) => number} fn - weight getter. Should be between 0 and 1
	 * @returns {string}
	 */
	getRandomKey(obj, fn = x => x) {
		const keys = Object.keys(obj);
		const weights = Object.values(obj).map(value => fn(value) * 100);
		return selectionUtils._roulette(keys, weights);
	},

	getRandomKeyByWeight(obj) {
		return selectionUtils.getRandomKey(obj, x => x.weight);
	},

	_roulette(keys, weights) /*: string (key)*/ {
		let rouletteArray = [];

		keys.forEach((key, i) => {
			rouletteArray = rouletteArray.concat(arrayUtils.make(key, weights[i]));
		});

		const index = numberUtils.randomBetween(rouletteArray.length);
		return rouletteArray[index];
	}
};

export const randomUtils = {
	headsOrTails() {
		return Math.random() > 0.5;
	}
};

export { default as notesUtils } from './utils/NotesUtils.js';

// https://gist.github.com/jed/982883
export const uuid = a => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);

export {
	objectUtils as objUtils,
	numberUtils,
	stringUtils,
	selectionUtils
};
