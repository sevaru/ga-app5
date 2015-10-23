import { arrayUtils, objUtils } from './utils';
import { availableValues } from './common';
import Mutations from './mutations/Mutations';


//TODO: redo with options?
const CROSSOVER_RATE = 0.5;

export default class Individual {
	constructor(referenceIndividual, useReferenceForStart = true) {
		this._reference = referenceIndividual.slice();
		this._content = useReferenceForStart ? 
			this._reference :
			this._reference.map(() => arrayUtils.randomElement(availableValues));
	}

	mutate(options) {
		//TODO: redo mutations to mo explicit way (not just random!)
		this._content = objUtils.randomElement(Mutations)(this._content, options);
	}

	crossover( someone ) {
		let someoneGens = someone.content;
		let myGens = this.content;

		this._content = this._content.map(( item, index ) => {
			return Math.random() > CROSSOVER_RATE ? myGens[index] : someoneGens[index];
		});
	}

	fitness() {
		/*1) Fitness by reference individual*/
		/* assume check notes or structure ([14,]-1,-1,-1 == [15,]-1,-1,-1 ) */
		let length = this._content;
		
		return this._content.reduce((prev, item, index) => {
			return prev + Number(item === this._reference[index]) / length;
		}, 0);

	}

	// Always return by value!
	get content() {
		return this._content.slice();
	}

	//TODO: redo with decorator
	static create(a, b = true) {
		return new Individual(a, b);
	}
}