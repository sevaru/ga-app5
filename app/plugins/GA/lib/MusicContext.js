import SimpleStorage from './SimpleStorage.js';
import {REFERENCE_INDIVIDUAL} from './common';

const DEFAULT_BAR_LENGTH = 8;

// TODO: use MusicContext instead
export const availableValuesInGF = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const PAUSE = 0;
export const HOLD = -1;

// TODO: used in composition/s jsx
class MusicContext {
	getCompositionLength() {
		return 128;
	}

	getAllCompositions() {
		return SimpleStorage.getKeys();
	}

	isValidName( name ) {
		return this.getAllCompositions().indexOf(name) === -1;
	}

	save( name, composition ) {
		return SimpleStorage.save(name, composition);
	}

	remove(name) {
		return SimpleStorage.remove(name);
	}

	getByKey(key) {
		return SimpleStorage.getByKey(key);
	}

	getDefault() {
		return SimpleStorage.getDefault();
	}

	getBarLength() {
		// FIXME: HARDCODE FOR NOW
		return DEFAULT_BAR_LENGTH;
	}

	getMaxOneOctaveValue() {
		return 7;
	}

	getAvailableValues(ignoreOctaves) {
		const maxOneOctaveValue = this.getMaxOneOctaveValue();
		return ignoreOctaves ? 
			availableValuesInGF.filter(x => x <= maxOneOctaveValue) :
			availableValuesInGF;
	}

	getAvailablePitchValues() {
		const excludeArray = [PAUSE, HOLD];
		return availableValuesInGF.filter(x => !excludeArray.includes(x));
	}

	getInGF() {
		return REFERENCE_INDIVIDUAL.slice();
	}

	// TODO: here for now
	getIntervalReference() {
		//only for Cmaj in halftones
		const INTERVAL_REFERENCE = [
			//First octave
			2, //C-D
			2, //D-E
			1, //E-F
			2, //F-G
			2, //G-A
			2, //A-B
			1, //B-C
			//Second octave
			2, //C-D
			2, //D-E
			1, //E-F
			2, //F-G
			2, //G-A
			2, //A-B
			1  //B-C
		];

		return INTERVAL_REFERENCE;
	}

	getHalfTonesBeetween(a, b) {
		const intervalReference = this.getIntervalReference();
		if ( a > b ) {
			const temp = a;
			a = b;
			b = temp;
		}

		const arrayToSum = intervalReference.slice(a, b);

		return arrayToSum.reduce((prevValue, item) => {
			return prevValue + item;
		}, 0);
	}
}

export default new MusicContext();
