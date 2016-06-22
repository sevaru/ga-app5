import _ from 'lodash';
import { selectionUtils } from '../utils.js';
import BaseCalculateProvider from './BaseCalculateProvider';

export default class CompositeCalculateProvider extends BaseCalculateProvider {
	/**
	 * @description Gets run function once
	 */
	getRunOnce(options) {
		// get bounded fn and keys * weights

		const MAX_WEIGHT = Object
			.keys(options)
			.map(k => options[k].weight)
			.reduce((sum, weight) => sum + weight, 0);

		const keyWeightRaw = _(options)
			.pickBy(({ weight }) => weight > 0);

		let keyWeight = keyWeightRaw
			.mapValues(v => v.weight / MAX_WEIGHT)
			.value();

		// NOTE: pick first provider with _important key if it's here
		// TODO: DEBUG {
		{
			const debugKeyWeight = 
				Object
					.keys(options)
					.reduce((reducer, key) => {
						const { _important } = options[key];

						if (reducer.found) {
							return reducer;
						}

						if (_important) {
							reducer.found = true;
							reducer.value[key] = 1;
						}

						return reducer;
					}, { found: false, value: {} })
					.value;
			if (!_.isEmpty(debugKeyWeight)) {
				keyWeight = debugKeyWeight;
			}
		}
		// }

		// TODO: refactor it
		const fns = Object
			.keys(keyWeight)
			.reduce((reducer, key) => {
				const settings = options[key];
				const weight = keyWeight[key];
				console.log(weight);
				const fn = this._all[key].run;

				reducer[key] = (...args) => {
					const result = fn(...args.concat(settings)) * weight;
					console.assert(result >= 0, `Fail on key: ${key}`); 
					return result;
				};
				return reducer;
			}, {});

		return (...data) => {
			return Object
				.keys(fns)
				.map(k => fns[k])
				.reduce((reducer, fn) => { 
					return reducer + fn(...data);
				}, 0);
		}
	}

	getRunRandom() {
		throw new Error('CompositeCalculateProvider use only run once fn');
	}
}