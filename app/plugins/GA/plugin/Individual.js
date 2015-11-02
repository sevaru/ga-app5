import { arrayUtils, objUtils, numberUtils } from './utils';
import { availableValues } from './common';
import Mutations from './mutations/Mutations';
import TwoPointCrossOver from './crossovers/TwoPointCrossOver.js';

export default class Individual {
	constructor(referenceIndividual, useReferenceForStart = true) {
		this._reference = referenceIndividual.slice();
		this._content = useReferenceForStart ? 
			this._reference.map(() => arrayUtils.randomElement(availableValues)) :
			this._reference;
	}

	mutate(options) {
		//TODO: redo mutations to mo explicit way (not just random!)
		this._content = objUtils.randomElement(Mutations)(this._content, options);
	}

	crossover( someone ) {
		const newContent = TwoPointCrossOver.crossover(this.content, someone.content);
		return new Individual(newContent, true);
	}

	fitness() {
		/*1) Fitness by reference individual*/
		/* assume check notes or structure ([14,]-1,-1,-1 == [15,]-1,-1,-1 ) */
		let length = this._content.length;
		
		return this._content.reduce((prev, item, index) => {
			return prev + (Number(item === this._reference[index]) / length);
		}, 0);
	}

	// Always return by value!
	get content() {
		return this._content.slice();
	}

	//TODO: redo with decorator
	static create(a, b) {
		return new Individual(a, b);
	}
}