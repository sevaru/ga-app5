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
			.reduce((max, weight) =>
				max > weight ? max : weight, 0);


		const keyWeightRaw = _(options)
			.pickBy(({ weight }) => weight > 0);

		const COUNT = keyWeightRaw.size();

		const keyWeight = 
			keyWeightRaw
			.mapValues(v => v.weight / MAX_WEIGHT * COUNT)
			.value();

		// TODO: refactor it
		const fns = Object
			.keys(keyWeight)
			.reduce((reducer, key) => {
				const settings = options[key];
				const weight = keyWeight[key];
				const fn = this._all[key].run;

				reducer[key] = (...args) => {
					return fn(...args.concat(settings)) * keyWeight[key];
				};
				return reducer;
			}, {});

		return (...data) => {
			return Object
				.keys(fns)
				.map(k => fns[k])
				.reduce((reducer, fn) =>
					fn(...data), 0);
		}
	}

	getRunRandom() {
		throw new Error('CompositeCalculateProvider use only run once fn');
	}
}
