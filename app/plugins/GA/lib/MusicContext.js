import SimpleStorage from './SimpleStorage.js';
import {REFERENCE_INDIVIDUAL} from './common';

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

	getInGF() {
		return REFERENCE_INDIVIDUAL.slice();
	}
}

export default new MusicContext();
export const availableValuesInGF = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];