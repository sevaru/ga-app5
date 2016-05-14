import { numberUtils, randomUtils } from '../../utils';

function createPortion(source, firstPoint, secondPoint) {
	return [source.slice(0, firstPoint), source.slice(firstPoint, secondPoint), source.slice(secondPoint)];
}

function crossover(a, b) {
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

	const aPortions = createPortion(a, firstPoint, secondPoint);
	const bPortions = createPortion(b, firstPoint, secondPoint);

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

		if ( randomUtils.headsOrTails() ) {
			result = result.concat(aPortions[i]);
			aUsed = true;
		} else {
			result = result.concat(bPortions[i]);
			bUsed = true;
		}
	}

	return result;
}

const getInitialState = () => ({ weight: 0.7 });

export default {
	name: 'two-point-crossover',
	getInitialState,
	run: crossover
};
