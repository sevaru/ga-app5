import { arrayUtils } from '../../utils';

function crossover(a, b) {
	const clone = b.slice();
	const indexes = arrayUtils.getRandomIndexes(a.length / 2, a.length);

	indexes
		.forEach(index => {
			clone[index] = a[index];
		});

	return clone;
}

const getInitialState = () => ({ weight: 0.5 });

export default {
	name: 'random-crossover',
	run: crossover,
	getInitialState
};
