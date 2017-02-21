import { arrayUtils } from './utils';
import { availableValues } from './common';

export default class Individual {
	/**
	 * @param {Array<number>} referenceIndividual
	 * @param {Array<number>} contentToStart
	 * @param {number} fitnessValue
	 * @param {boolean} useRandomToStart
	 * @param {Object} context
	 * @param {Function} context.crossover
	 * @param {Function} context.mutation
	 * @param {Function} context.fitness
	 */
	constructor(referenceIndividual, contentToStart, fitnessValue, useRandomToStart = true, context) {
		// -----------------------------
		// -1) Save context
		// -----------------------------
		this._context = context;


		// -----------------------------
		// 0) Reference individual
		// -----------------------------
		this._reference = referenceIndividual.slice();

		// -----------------------------
		// 1) Content to start
		// -----------------------------
		if (contentToStart) {
			this._content = contentToStart;
		} else {
			this._content = useRandomToStart ?
				this._reference.map(() => arrayUtils.randomElement(availableValues)) :
				referenceIndividual.slice();
		}

		// -----------------------------
		// 2) Content to start
		// -----------------------------
		this._fitnessValue = fitnessValue == null ? this.fitness().value : fitnessValue;
	}

	clone() {
		return new Individual(this._reference, this.content, this.fitnessValue, false, this._context);
	}

	/**
	 * @description Mutate and recalculate inner fitnessValue
	 */
	mutate(options) { // TODO: pass options to this._context.mutation(..., options) ???
		this._checkContext();
		this._content = this._context.mutation(this._content);
		this._fitnessValue = this.fitness().value;
	}

	crossover(someone) {
		this._checkContext();
		const newContent = this._context.crossover(this.content, someone.content);
		return new Individual(this._reference, newContent, null, false, this._context);
	}

	fitness() {
		this._checkContext();
		return this._context.fitness(this.content, this._reference);
	}

	/**
	 * @description NOTE: Always returns by value
	 */
	get content() {
		return this._content.slice();
	}

	get fitnessValue() {
		return this._fitnessValue;
	}

	getHash() {
		return this._content.join();
	}

	toDTO() {
		return {
			_fitnessValue: this._fitnessValue,
			_reference: this._reference.slice(),
			_content: this._content.slice()
		}
	}

	toFullFitnessDTO() {
		return {
			fitness: this.fitness(),
			content: this._content.slice()
		};
	}

	_checkContext() {
		if (!this._context) {
			throw new Error('Context is not defined, created via fromDTO');
		}
	}

	// TODO: find out better way of getting private fields, maybe create toDTO (in worker) and fromDTO (in UI tread)
	static fromDTO({ _reference, _content, _fitnessValue }) {
		return new Individual(_reference, _content, _fitnessValue, false);
	}
}