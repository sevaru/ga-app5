import Individual from './Individual';
import { REFERENCE_INDIVIDUAL } from './common';

const defaultOptions = {
    deathLimit: 0.7,
    count: 25,
	threshold: 0.9, /* End processing when someone near good (best 1) */
    maxIterations: 500,
    mutationProbability: 0.2,
    useRandomInitialIndividuals: true
};

export default class GA {
	constructor( preferences ) {
		this._options = Object.assign({}, defaultOptions, preferences);
		this._population = [];
		this._bestGuys = [];
	}
	
	//-----------------------------
    //  1. Initial Population
    //-----------------------------
	_createInitialPopulation() {
        this._population = [];

        for ( var i = 0; i < this._options.count; i++ ) {
            this._population.push(
            	Individual.create(REFERENCE_INDIVIDUAL, this._options.useRandomInitialIndividuals)
        	);    
        }
    }

    //-----------------------------
    //  2. Mutate/Crossover
    //-----------------------------
    //TODO: redo in functional way (no mutations);
    _crossover() {
        this._population.forEach(( item, index, array ) => {
            let neightbour = (array.length === this._population.length) ? array[0] : array[index + 1];
            item.crossover(neightbour);
        });
    }
    _mutate() {
        this._population.forEach(( item ) => {
            if ( Math.random() < this._options.mutationProbability ) {
                item.mutate(this._options);
            }
        });
    }

    //-----------------------------
    //  3. Selection
    //-----------------------------
    _selection() {
        this._bestGuys = this._population.filter(item => {
			return item.fitness() > this._options.deathLimit;
        });
    }

    //-----------------------------
    //  4. Create New Population
    //-----------------------------
    //TODO: redo in functional way!
    _createNewPopulation() {
        let newPopulation = [];

        for ( var i = 0, l = (this._options.count - this._bestGuys.length); i < l; i++ ) {
            newPopulation.push(Individual.create(REFERENCE_INDIVIDUAL));
        }

        this._population = this._bestGuys.concat(newPopulation);
    }

    //-----------------------------
    //  5. Finish!
    //-----------------------------
    _isDone() {
        return this._population.some(item => item.fitness() > this._options.threshold);
    }

	run() {
		let i = 0;
		
        this._createInitialPopulation();

        do {
            this._mutate();
            this._crossover();
            this._selection();
            this._createNewPopulation();
			i++;
			
			console.log('iteration: ' + i);
			
        } while ( !this._isDone() && i < this._options.maxIterations );
		
		this._population.unshift(Individual.create(REFERENCE_INDIVIDUAL));
		
        return this._population;
	}

} 