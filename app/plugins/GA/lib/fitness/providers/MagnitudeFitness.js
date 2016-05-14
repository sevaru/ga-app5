import calculator from './MagnitudeFitness/calculate.js';

const run = calculator.fitness.bind(calculator);
const getInitialState = () => ({ weight: 0 });

export default {
	name: 'magnitude-fitness',
	run,
	getInitialState
};
