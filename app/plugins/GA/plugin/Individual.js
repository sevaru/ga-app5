import { arrayUtils, objUtils, numberUtils } from './utils';
import { availableValues } from './common';
import MutationProvider from './mutations/MutationProvider.js';
import CrossoverProvider from './crossovers/CrossoverProvider.js';
import FitnessProvider from './fitness/FitnessProvider.js';

export default class Individual {
	constructor(referenceIndividual, contentToStart, fitnessValue, useRandomToStart = true) {
		// -----------------------------
		// 0) Reference individual
		// -----------------------------
		// -----------------------------
		this._reference = referenceIndividual.slice();

		// 1) Content to start
		// -----------------------------
		if ( contentToStart ) {
			this._content = contentToStart;
		} else {
			this._content = useRandomToStart ? 
				this._reference.map(() => arrayUtils.randomElement(availableValues)) :
				referenceIndividual.slice();
		}

		// -----------------------------
		// 2) Content to start
		// -----------------------------
		this._fitnessValue = fitnessValue != null ? fitnessValue : this.fitness();
	}

	// Mutate and recalculate inner fitnessValue
	mutate(options) {
		this._content = MutationProvider.mutate(this._content);
		this._fitnessValue = this.fitness();
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

	get fitnessValue() {
		return this._fitnessValue;
	}

	toDTO() {
		return {
			_fitnessValue: this._fitnessValue,
			_reference: this._reference.slice(),
			_content: this._content.slice()
		}
	}

	// TODO: find out better way of getting private fields, maybe create toDTO (in worker) and fromDTO (in UI tread)
	static fromDTO({_reference, _content, _fitnessValue}) {
		return new Individual(_reference, _content, _fitnessValue, false);
	}

	//TODO: redo with decorator
	static create(a, b, c, d) {
		return new Individual(a, b, c, d);
	}
}