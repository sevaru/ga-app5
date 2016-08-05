const FIRMWARE_INDIVIDUAL_KEY = 'default';
const FIRMWARE_INDIVIDUAL = [
	3, -1, 3, -1, 3, -1, -1, -1,
	3, -1, 3, -1, 3, -1, -1, -1,
	3, -1, 5, -1, 1, -1, -1, 2,
	3, -1, -1, -1, -1, -1, -1, -1,

	4, -1, 4, -1, 4, -1, -1, 4,
	4, -1, 3, -1, 3, -1, 3, 3,
	3, -1, 2, -1, 2, -1, 3, -1,
	2, -1, -1, -1, 5, -1, -1, -1,

	3, -1, 3, -1, 3, -1, -1, -1,
	3, -1, 3, -1, 3, -1, -1, -1,
	3, -1, 5, -1, 1, -1, -1, 2,
	3, -1, -1, -1, -1, -1, -1, -1,


	4, -1, 4, -1, 4, -1, -1, 4,
	4, -1, 3, -1, 3, -1, 3, 3,
	5, -1, 5, -1, 4, -1, 2, -1,
	1, -1, -1, -1, -1, -1, -1, -1
];

const ALL_KEY = '__all';
const CURRENT_KEY = '__current';

class SimpleStorage {
	getKeys() {
		const keys = this._getKeys();
		if ( !keys ) {
			return [FIRMWARE_INDIVIDUAL_KEY];
		}
		keys.unshift(FIRMWARE_INDIVIDUAL_KEY);
		return keys;
	}

	_getKeys() {
		const keysRaw = localStorage.getItem(ALL_KEY);
		return JSON.parse(keysRaw);
	}

	getDefault() {
		return FIRMWARE_INDIVIDUAL;
	}

	getByKey( key ) {
		if ( key === FIRMWARE_INDIVIDUAL_KEY ) {
			return this.getDefault();
		}

		let compositionRaw = localStorage.getItem(key);
		if ( !compositionRaw ) {
			return null;
		}
		return JSON.parse(compositionRaw);
	}

	save( key, value ) {
		try {
			value = JSON.stringify(value);
			localStorage.setItem(key, value);
			let prevKeys = JSON.parse(localStorage.getItem(ALL_KEY)) || [];

			if ( prevKeys.indexOf(key) === -1 ) {
				prevKeys.push(key);
			}

			localStorage.setItem(ALL_KEY, JSON.stringify(prevKeys));
		} catch (e) {
			console.warn('You got invalid data');
			return false;
		}
		return true;
	}

	getCurrentKey() {
		return localStorage.getItem(CURRENT_KEY) || 'default';
	}

	getCurrent() {
		return this.getByKey(this.getCurrentKey());
	}

	setCurrent( key ) {
		localStorage.setItem(CURRENT_KEY, key);
	}

	remove( key ) {
		let prevKeys = JSON.parse(localStorage.getItem(ALL_KEY)) || [];
		const index = prevKeys.indexOf(key);
		if (  index !== -1 ) {
			prevKeys.splice(index, 1);
		}
		localStorage.setItem(ALL_KEY, JSON.stringify(prevKeys));
		localStorage.removeItem(key);
	}

	clear() {
		localStorage.clear();
	}
}

export default new SimpleStorage();