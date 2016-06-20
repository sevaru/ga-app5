import { selectionUtils } from '../utils.js';

export default class BaseCalculateProvider {
	constructor(allPlugins, initialState, key) {
		this._options = undefined;
		this._all = allPlugins;
		this._key = key;
		this._registerInStore(initialState);
	}

	/**
	 * @description Gets run function once
	 */
	getRunOnce(options) {
		return this._getFunction(options).fn.run;
	}

	getRunRandom(options) {
		return (...args) => {
			const { fn, key } = this._getFunction(options);
			const argsExtended = args.concat(options[key]);
			return fn.run(...argsExtended);
		}
	}

	_getFunction(options) {
		const key = selectionUtils.getRandomKeyByWeight(options);
		return {
			key,
			fn: this._all[key] 
		};
	}

	_registerInStore(initialState) {
		initialState[this._key] = {};
		Object
			.keys(this._all)
			.map(key => this._all[key])	
			.forEach(({name, getInitialState}) => initialState[this._key][name] = getInitialState());
	}
}
