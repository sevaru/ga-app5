import { numberUtils } from '../utils';

class OnePointCrossover {
	_createPortion(source, point) {
		return [source.slice(0, point), source.slice(point)];
	}

	crossover( a, b ) {
		let result = [];
		let point = numberUtils.randomBetween(a.length);

		const aPortions = this._createPortion(a, point);
		const bPortions = this._createPortion(b, point);

		if ( Math.random() > 0.5 ) {
			result = result.concat(aPortions[0], bPortions[1]);
		} else {
			result = result.concat(bPortions[0], aPortions[1]);
		}

		return result;
	}
}

export default new OnePointCrossover();