import { selectionUtils } from '../utils.js';

/**
 * @description Provides calculation fn
 * 1) Once (current fitness, crossover)
 * 2) New everytime (mutations)
 */
export default class BaseCalculateProvider {
	constructor(allPlugins, initialState, name) {
		this._all = allPlugins;
		this._providerName = name; // Mutation, Crossover, Fitness. (any Genetic Operator)
		this._registerInStore(initialState);
	}

	/**
	 * @description Gets run function once
	 */
	getRunOnce(options) {
		const { fn, key } = this._getKeyAndFunction(options);
		const settings = options[key];

		return (...args) => {
			return fn.run(...args.concat(settings));
		}
	}

	getRunRandom(options) {
		return (...args) => {
			const { fn, key } = this._getKeyAndFunction(options);
			const argsExtended = args.concat(options[key]);
			return fn.run(...argsExtended);
		}
	}

	_getKeyAndFunction(options) {
		const key = this._getKey(options);
		const fn = this._getFunction(key);
		return { key, fn };
	}

	_getKey(options) {
		return selectionUtils.getRandomKeyByWeight(options);
	}
	
	_getFunction(key) {
		return this._all[key];
	}

	_registerInStore(initialState) {
		initialState[this._providerName] = {};
		Object
			.keys(this._all)
			.map(key => this._all[key])	
			.forEach(({ name, getInitialState }) =>
				initialState[this._providerName][name] = getInitialState());
	}
}
