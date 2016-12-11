import { arrayUtils } from './utils';
import { availableValues } from './common';

export default class Individual {
	// TODO: extract logic of creation to factory
	// createFromReference
	// createRandom
	// createDTO
	// factory = new IndividualFactory(context);
	constructor(referenceIndividual, contentToStart, fitnessValue, useRandomToStart = true, context) {
		// -----------------------------
		// -1) Save context IContext { crossover }
		// -----------------------------
		if (!context) {
			console.log('Called without context, probably only for presentation purpose');
		}
		this._context = context;


		// -----------------------------
		// 0) Reference individual
		// -----------------------------
		this._reference = referenceIndividual.slice();

		// -----------------------------
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
		this._fitnessValue = fitnessValue == null ? this.fitness().value : fitnessValue;
	}

	// Mutate and recalculate inner fitnessValue
	mutate(options) {
		this._content = this._context.mutation(this._content);
		this._fitnessValue = this.fitness().value;
	}

	crossover( someone ) {
		const newContent = this._context.crossover(this.content, someone.content);
		return new Individual(this._reference, newContent, null, false, this._context);
	}

	fitness() {
		return this._context.fitness(this.content, this._reference);
	}

	// Always return by value!
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

	// TODO: find out better way of getting private fields, maybe create toDTO (in worker) and fromDTO (in UI tread)
	static fromDTO({_reference, _content, _fitnessValue}) {
		return new Individual(_reference, _content, _fitnessValue, false);
	}

	//TODO: redo with decorator
	static create(a, b, c, d, e) {
		return new Individual(a, b, c, d, e);
	}
}