import Individual from './Individual';
import { REFERENCE_INDIVIDUAL } from './common';

const defaultOptions = {
    deathLimit: 0.5,
    count: 25,
	threshold: 0.8, /* End processing when someone near good (best 1) */
    maxIterations: 1000,
    mutationProbability: 0.2,
    useRandomInitialIndividuals: true,
    countOfBestToLiveThrought: 0
};

export default class GA {
	constructor( preferences ) {
		this._options = Object.assign({}, defaultOptions, preferences);
        console.log(this._options);
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

        const count = this._options.countOfBestToLiveThrought;

        if ( count && this._bestGuys.length < count ) {
            const offset = this._bestGuys.length;
            let population = this._sortByFitness(this._population);

            for ( let i = offset; i < count; i++ ) {
                this._bestGuys.push(population[i]);
            }
        }
    }

    //-----------------------------
    //  4. Create New Population
    //-----------------------------
    //TODO: redo in functional way!
    _createNewPopulation() {
        let newPopulation = [];

        for ( var i = 0, l = (this._options.count - this._bestGuys.length); i < l; i++ ) {
            newPopulation.push(Individual.create(REFERENCE_INDIVIDUAL, this._options.useRandomInitialIndividuals));
        }

        this._population = this._bestGuys.concat(newPopulation);
    }

    //-----------------------------
    //  5. Finish!
    //-----------------------------
    _isDone() {
        return this._population.some(item => item.fitness() > this._options.threshold);
    }

    _getBest() {
        let best = 0;
        this._population.forEach(item => {
            const f = item.fitness();
            if ( f > best ) {
                best = f;
            }
        });
        return best;
    }

    _sortByFitness( population, desc = 1 ) {
        return population.slice().sort((a, b) => {
            let af = a.fitness(); 
            let bf = b.fitness();

            if ( af === bf ) {
                return 0;
            }

            return af > bf ? -desc : desc;
        });
    }

	run() {
		let i = 0;
		
        this._createInitialPopulation();

        do {
            this._selection();
            this._mutate();
            this._crossover();
            this._createNewPopulation();
			i++;

            if ( i % 50 === 0 ) {
                console.log(`iteration: ${i}, best: ${this._getBest()}`);
            }

        } while ( !this._isDone() && i < this._options.maxIterations );

        this._population.unshift(Individual.create(REFERENCE_INDIVIDUAL, false));
        this._population = this._sortByFitness(this._population);

        return this._population;
	}

} 