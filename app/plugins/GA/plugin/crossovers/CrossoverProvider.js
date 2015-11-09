import TwoPointCrossover from './TwoPointCrossover.js';
import OnePointCrossover from './OnePointCrossover.js';

class CrossoverProvider {
	constructor() {
		this._options = undefined;
		this._hash = {
			twoPointCrossover: TwoPointCrossover.crossover.bind(TwoPointCrossover),
			onePointCrossover: OnePointCrossover.crossover.bind(OnePointCrossover)
		};
	}

	setOptions(options) {
		this._options = options;
	}

	crossover(a, b) {
		if ( !this._options ) {
			throw 'Specify options first';
		}
		return this._getCrossover()(a, b);
	}

	_getCrossover() {
		//find first that "on"
		let crossover = null;
		Object.keys(this._options).some(key => {
			if ( this._options[key] ) {
				crossover = this._hash[key];
				return true;
			}
		});
		return crossover;
	}
}

export default new CrossoverProvider();