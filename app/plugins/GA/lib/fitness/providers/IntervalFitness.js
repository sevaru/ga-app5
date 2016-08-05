import calculator from './IntervalFitness/calculate.js';

const run = calculator.fitness.bind(calculator);
const getInitialState = () => ({ weight: 0 });

// TODO: Сделать отрисовку дополнительных опций для передачи их черех executorFabric
/*
const defaultOptions = {
	intervalValuesWeight: 0.5,
	intervalDispersionWeight: 0.5
};
 */

export default {
	name: 'interval-fitness',
	run,
	getInitialState
};
