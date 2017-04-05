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

const localStorageInstance = global.localStorage || {
	getItem() {
		return undefined;
	},
	setItem() {
		return undefined;
	},
	removeItem() {
		return undefined;
	},
	clear() {
		return undefined;
	}
};

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
		const keysRaw = localStorageInstance.getItem(ALL_KEY);
		return JSON.parse(keysRaw);
	}

	getDefault() {
		return FIRMWARE_INDIVIDUAL;
	}

	getByKey( key ) {
		if ( key === FIRMWARE_INDIVIDUAL_KEY ) {
			return this.getDefault();
		}

		let compositionRaw = localStorageInstance.getItem(key);
		if ( !compositionRaw ) {
			return null;
		}
		return JSON.parse(compositionRaw);
	}

	save( key, value ) {
		try {
			value = JSON.stringify(value);
			localStorageInstance.setItem(key, value);
			let prevKeys = JSON.parse(localStorageInstance.getItem(ALL_KEY)) || [];

			if ( prevKeys.indexOf(key) === -1 ) {
				prevKeys.push(key);
			}

			localStorageInstance.setItem(ALL_KEY, JSON.stringify(prevKeys));
		} catch (e) {
			console.warn('You got invalid data');
			return false;
		}
		return true;
	}

	getCurrentKey() {
		return localStorageInstance.getItem(CURRENT_KEY) || 'default';
	}

	getCurrent() {
		return this.getByKey(this.getCurrentKey());
	}

	setCurrent( key ) {
		localStorageInstance.setItem(CURRENT_KEY, key);
	}

	remove( key ) {
		let prevKeys = JSON.parse(localStorageInstance.getItem(ALL_KEY)) || [];
		const index = prevKeys.indexOf(key);
		if (  index !== -1 ) {
			prevKeys.splice(index, 1);
		}
		localStorageInstance.setItem(ALL_KEY, JSON.stringify(prevKeys));
		localStorageInstance.removeItem(key);
	}

	clear() {
		localStorageInstance.clear();
	}
}

export default new SimpleStorage();