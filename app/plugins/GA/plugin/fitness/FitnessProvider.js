import BasicReferenceFitness from './BasicReferenceFitness.js';
import MagnitudeFitness from './MagnitudeFitness.js';
import MelodyFitness from './MelodyFitness.js';
import IntervalFitness from './IntervalFitness.js';

class FitnessProvider {
	constructor() {
		this._options = undefined;
		this._hash = {
			basicReferenceFitness: BasicReferenceFitness.fitness.bind(BasicReferenceFitness),
			magnitudeFitness: MagnitudeFitness.fitness.bind(MagnitudeFitness),
			melodyFitness: MelodyFitness.fitness.bind(MelodyFitness),
			intervalFitness: IntervalFitness.fitness.bind(IntervalFitness)
		};
	}

	setOptions(options) {
		this._options = options;
		this._reset();
	}

	fitness(content, reference) {
		if ( !this._options ) {
			throw 'Specify options first';
		}
		const { fitness, options } = this._getFitness();
		return fitness(content, reference, options);
	}

	_reset() {
		Object.keys(this._hash).forEach(key => {
			const resetFn = this._hash[key].reset;

			if ( typeof resetFn === 'function' ) {
				resetFn.call(this._hash[key]);
			}
		});
	}

	_getFitness() {
		//find first that "on"
		let fitness = null;
		let options = null;
		Object.keys(this._options).some(key => {
			options = this._options[key]; 
			if ( options.on ) {
				fitness = this._hash[key];
				return true;
			}
		});
		return { fitness, options };
	}
}

export default new FitnessProvider();