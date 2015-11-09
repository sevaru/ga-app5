import Individual from './Individual';
import { REFERENCE_INDIVIDUAL } from './common';
import CrossoverProvider from './crossovers/CrossoverProvider.js';
import MutationProvider from './mutations/MutationProvider.js';
import FitnessProvider from './fitness/FitnessProvider.js';

const defaultOptions = {
    GA: {
        deathLimit: 0.5,
        count: 25,
    	threshold: 0.8, /* End processing when someone near good (best 1) */
        maxIterations: 1000,
        mutationProbability: 0.2,
        useRandomInitialIndividuals: true,
        countOfBestToLiveThrought: 0
    }
};

export default class GA {
	constructor( preferences ) {
		this._options = Object.assign({}, defaultOptions, preferences);
		this._population = [];
        this._bestOne = null;

        CrossoverProvider.setOptions(this._options.crossover)
        MutationProvider.setOptions(this._options.mutation);
        FitnessProvider.setOptions(this._options.fitness);
	}
	
	//-----------------------------
    //  1. Initial Population
    //-----------------------------
	_createInitialPopulation() {
        this._population = [];

        for ( var i = 0; i < this._options.GA.count; i++ ) {
            this._population.push(
            	Individual.create(REFERENCE_INDIVIDUAL, null, this._options.GA.useRandomInitialIndividuals)
        	);    
        }
    }

    //-----------------------------
    //  2. Mutate/Crossover
    //-----------------------------
    //TODO: redo in functional way (no mutations);
    _crossover() {
        let result = [];
        let clones = this._population.slice();
        clones = this._sortByFitness(clones);

        while ( clones.length > 2 ) {
            const mama = clones.pop();
            const papa = clones.pop();
            const baby = papa.crossover(mama);
            result.push(baby);
        }

        return result;
    }

    _mutate(population) {
        let clones = population.slice();
        clones.forEach(item => {
            if ( Math.random() < this._options.GA.mutationProbability ) {
                item.mutate(this._options.GA);
            }
        });
        return clones;
    }

    //-----------------------------
    //  3. Selection
    //-----------------------------
    _selection(newPopulation) {
        //TODO: remove i - #for_debug
        let goodGuys = newPopulation.filter((item, i) => {
            return item.fitness() > this._options.GA.deathLimit;
        });

        const count = this._options.GA.countOfBestToLiveThrought;

        if ( count && goodGuys.length < count ) {
            const offset = goodGuys.length;
            let population = this._sortByFitness(newPopulation);

            for ( let i = offset; i < count; i++ ) {
                goodGuys.push(population[i]);
            }
        }

        return goodGuys;
    }

    //-----------------------------
    //  4. Create New Population
    //-----------------------------
    //TODO: redo in functional way!
    _createNewPopulation(newPopulation) {
        let population = newPopulation.slice();

        const need = this._options.GA.count - population.length; 

        // if we need more guys
        if ( need > 0 ) {
            for ( var i = 0; i < need; i++ ) {
                population.push(Individual.create(REFERENCE_INDIVIDUAL, null, this._options.GA.useRandomInitialIndividuals));
            }
        // if we need cut someone
        } else {
            population = this._sortByFitness(population).slice(0, this._options.GA.count);
        }

        return population;
    }

    //-----------------------------
    //  5. Finish!
    //-----------------------------
    _isDone() {
        return this._population.some(item => item.fitness() > this._options.GA.threshold);
    }

    _getBest(population) {
        population = population || this._population;
        let bestFitness = this._bestOne ? this._bestOne.fitness() : 0;
        population.forEach(item => {
            const f = item.fitness();
            if ( f > bestFitness ) {
                bestFitness = f;
                this._bestOne = item;
            }
        });
        return bestFitness;
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
            let parents = this._population.slice();

            let children = this._crossover();
            children = this._mutate(children);

            let newPopulation = this._selection([].concat(children, parents));

            this._population = this._createNewPopulation(newPopulation);
            i++;

            if ( i % 50 === 0 ) {
                console.clear();
                console.log(`iteration: ${i}, best: ${this._getBest()}`);
            }

        } while ( !this._isDone() && i < this._options.GA.maxIterations );

        this._population = this._sortByFitness(this._population);
    
        const original = Individual.create(REFERENCE_INDIVIDUAL, null, false);

        if ( this._bestOne ) {
            this._population.unshift(this._bestOne);
        }
        
        this._population.unshift(original);
        return this._population;
	}

} 