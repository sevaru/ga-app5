import calculator from './MagnitudeFitness/calculate.js';

const run = calculator.fitness.bind(calculator);
const getInitialState = () => ({ weight: 0 });

// TODO: Сделать отрисовку дополнительных опций для передачи их черех executorFabric
/*
const defaultOptions = {
	pitch: 1,
	rhythm: 1,
	maxPitchDistance: 4
};
*/
export default {
	name: 'magnitude-fitness',
	run,
	getInitialState
};
