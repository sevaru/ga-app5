import { arrayUtils, objUtils, numberUtils } from './utils';
import { availableValues } from './common';
import MutationProvider from './mutations/MutationProvider.js';
import CrossoverProvider from './crossovers/CrossoverProvider.js';
import FitnessProvider from './fitness/FitnessProvider.js';

export default class Individual {
	constructor(referenceIndividual, contentToStart, useRandomToStart = true) {
		this._reference = referenceIndividual.slice();

		if ( contentToStart ) {
			this._content = contentToStart;
			return;
		}

		this._content = useRandomToStart ? 
			this._reference.map(() => arrayUtils.randomElement(availableValues)) :
			referenceIndividual.slice();
	}

	mutate(options) {
		this._content = MutationProvider.mutate(this._content);
	}

	crossover( someone ) {
		const newContent = CrossoverProvider.crossover(this.content, someone.content);
		return new Individual(this._reference, newContent);
	}

	fitness() {
		return FitnessProvider.fitness(this.content, this._reference);
	}

	// Always return by value!
	get content() {
		return this._content.slice();
	}

	//TODO: redo with decorator
	static create(a, b, c) {
		return new Individual(a, b, c);
	}
}