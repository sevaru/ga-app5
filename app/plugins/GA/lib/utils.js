function checkArray( arr ) {
	if ( !Array.isArray(arr) ) {
		throw new TypeError(`arr should be an array ${arr} given.`);
	}
}

function checkObj( obj ) {
	if ( !obj || typeof obj !== 'object' ) {
		throw new TypeError(`obj should be an object ${obj} given`);
	}
}

const numberUtils = {
	/**
	 * @param {number} startIndex
	 * @param {number} endIndex not included
	 * @returns {number}
	 */
	randomBetween( startIndex, endIndex ) {
		if (startIndex < 0 || endIndex < 0) {
			throw 'wft randomBetween';
		}
		if ( endIndex === undefined ) {
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
	}
};

const arrayUtils = {
	last( array ) {
		return array[array.length - 1];
	},

	make( value, length ) {
		let arr = [];
		while( length-- ) {
			arr[length] = value;
		}
		return arr;
	},

	getRandomIndexes( count /*: number */, length /*: number */, except /*: Array<number> //indexes */ ) {
		const result = [];

		if ( count > length ) {
			throw new Error('Count can\'t be more that length');
		}

		while( count > 0 ) {
			const newIndex = numberUtils.randomBetween(length);
			if ( result.indexOf(newIndex) !== -1 ) {
				continue;
			}

			if ( except && except.includes(newIndex) ) {
				continue;
			}

			result.push(newIndex);
			count--;
		}

		return result;
	},

	randomKey( arr ) {
		checkArray(arr);
		return numberUtils.randomBetween(arr.length);
	},
	
	randomElement( arr ) {
		const randomKey = arrayUtils.randomKey(arr);
		return arr[randomKey];
	},
	
	findObjectByKey( array, field, value ) {
		return array.find(element => element.hasOwnProperty(field) && element[field] === value);
	}
};

const objectUtils = {
	randomElement( obj ) {
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
	getRandomKeyByWeight( obj ) {
		const keys = Object.keys(obj);
		const weights = Object.keys(obj).map(key => obj[key].weight * 100);
		return selectionUtils._roulette(keys, weights);
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

const randomUtils = {
	headsOrTails() {
		return Math.random() > 0.5;	
	}
};

export { default as notesUtils } from './utils/NotesUtils.js';

export { 
	objectUtils as objUtils,
	arrayUtils,
	numberUtils,
	stringUtils,
	selectionUtils,
	randomUtils
};
