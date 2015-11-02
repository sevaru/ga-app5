import { numberUtils } from '../utils';

class TwoPointCrossOver {
	_createPortion(source, firstPoint, secondPoint) {
		return [source.slice(0, firstPoint), source.slice(firstPoint, secondPoint), source.slice(secondPoint, source.length - 1)];
	}

	crossover(a, b) {
		let result = [];
		let firstPoint = numberUtils.randomBetween(a.length);
		let secondPoint = numberUtils.randomBetween(a.length);
		let aUsed = false;
		let bUsed = false;

		while ( secondPoint === firstPoint ) {
			secondPoint = numberUtils.randomBetween(a.length);
		}

		if ( firstPoint > secondPoint ) {
			const temp = firstPoint;
			firstPoint = secondPoint;
			secondPoint = firstPoint;
		}

		const aPortions = this._createPortion(a, firstPoint, secondPoint);
		const bPortions = this._createPortion(b, firstPoint, secondPoint);

		for ( let i = 0, l = aPortions.length; i < l; i++ ) {
			if ( i === l - 1 ) {
				if ( !bUsed ) {
					result = result.concat(bPortions[i]);
					continue;
				} else if ( !aUsed ) {
					result = result.concat(aPortions[i]);
					continue;
				}
			}

			if ( Math.random() > 0.5 ) {
				result = result.concat(aPortions[i]);
				aUsed = true;
			} else {
				result = result.concat(bPortions[i]);
				bUsed = true;
			}
		}

		return result;
	}
}

export default new TwoPointCrossOver();