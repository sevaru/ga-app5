import { numberUtils } from '../../utils';

function createPortion(source, point) {
	return [source.slice(0, point), source.slice(point)];
}

function crossover(a, b) {
	const point = numberUtils.randomBetween(a.length);
	const aPortions = createPortion(a, point);
	const bPortions = createPortion(b, point);

	if ( Math.random() > 0.5 ) {
		return [].concat(aPortions[0], bPortions[1]);
	} else {
		return [].concat(bPortions[0], aPortions[1]);
	}
}

const getInitialState = () => ({ weight: 0.5 });

export default {
	name: 'one-point-crossover',
	run: crossover,
	getInitialState
};
