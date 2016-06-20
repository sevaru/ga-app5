import Individual from '../Individual';
import { REFERENCE_INDIVIDUAL } from '../common';
import {run as getCrossover} from '../crossovers/CrossoverProvider';
import {run as getMutation} from '../mutations/MutationProvider';
import {run as getFitness} from '../fitness/FitnessProvider';

import loop from './loop';

const defaultWorkerOptions = {
    onProgress: undefined,
    onDone: undefined,
    onPause: undefined,
    notifyRate: 100
};

/**
 * @class GA class instance performs ga experiment,
 * notify subscribers via passed workerOptions.
 * Mostly works in webWorker environment.
 */
export default class GA {
	constructor( preferences, workerOptions = {} ) {
		// 0) Grab and store options
        this._options = preferences.options;
        this._workerOptions = Object.assign({}, defaultWorkerOptions, workerOptions);
        
        // 1) Create context for individuals
        this._context = {
            crossover: getCrossover(preferences.crossover),
            mutation: getMutation(preferences.mutation),
            fitness: getFitness(preferences.fitness)
        };

        // 2) Set current state variables
        this._cleanState();

        // 3) Perform initial run
        this._run();
	}

    resume() {
        this._paused = false;
        this._run();
    }

    // TODO: redo stop logic (now embedded in _run)
    pause() {
        this._paused = true;
    }

    stop() {
        this._paused = true;
        this._stopped = true;
        // TODO: clean state for new execution?
    }

	
	//-----------------------------
    //  1. Initial Population
    //-----------------------------
    // TODO: redo as pure
	_createInitialPopulation() {
        this._population = [];

        for ( var i = 0; i < this._options.count; i++ ) {
            this._population.push(
            	Individual.create(REFERENCE_INDIVIDUAL, null, null, this._options.useRandomInitialIndividuals, this._context)
        	);    
        }
    }

    //-----------------------------
    //  2. Mutate/Crossover
    //-----------------------------
    //TODO: redo in functional way (no mutations);
    _crossover() {
        const result = [];
        const clones = this._sortByFitness(this._population.slice());

        while ( clones.length > 2 ) {
            const mama = clones.pop();
            const papa = clones.pop();
            const baby = papa.crossover(mama);
            result.push(baby);
        }

        return result;
    }

    _mutate(population) {
        const probability = this._options.mutationProbability;
        const clones = population.slice();
        return clones.map(item => {
            if ( Math.random() < probability ) {
                item.mutate();
            }
            return item;
        });
    }

    //-----------------------------
    //  3. Selection
    //-----------------------------
    _selection(newPopulation) {
        const deathLimit = this._options.deathLimit;
        const goodGuys = newPopulation.filter(item => item.fitnessValue > deathLimit);
        const count = this._options.countOfBestToLiveThrought;

        /*
        Если порог прохождения никто не прошел
        И установлено количество_выживающих_без_учета_фитнеса
        То берем ровно столько лучших возможных, сколько не хватает
         */
        if ( count && goodGuys.length < count ) {
            const bestWeHave = this._getBestWeHave(count, goodGuys.length, newPopulation);
            goodGuys.concat(bestWeHave);
        }

        return goodGuys;
    }

    // PURE
    // USE: _sortByFitness
    _getBestWeHave(countWeNeed, countWeHave, currentPopulation) {
        const result = [];
        const population = this._sortByFitness(currentPopulation);

        for ( let i = countWeHave; i < countWeNeed; i++ ) {
            result.push(population[i]);
        }
        return result;
    }

    //-----------------------------
    //  4. Create New Population
    //-----------------------------
    //TODO: redo in functional way!
    _createNewPopulation(newPopulation) {
        const population = newPopulation.slice();
        const need = this._options.count - population.length; 

        // if we need more guys
        if ( need > 0 ) {
            for ( var i = 0; i < need; i++ ) {
                population.push(Individual.create(REFERENCE_INDIVIDUAL, null, null, this._options.useRandomInitialIndividuals, this._context));
            }
            return population;
        }

        // if we need cut someone
        return this
                ._sortByFitness(population)
                .slice(0, this._options.count);
    }

    //-----------------------------
    //  5. Finish!
    //-----------------------------
    _isDone() {
        return this._population.some(item => item.fitnessValue > this._options.threshold);
    }

    _getBest(population) {
        population = population || this._population;
        let bestFitness = this._bestOne ? this._bestOne.fitnessValue : 0;
        population.forEach(item => {
            if ( item.fitnessValue > bestFitness ) {
                bestFitness = item.fitnessValue;
                this._bestOne = item;
            }
        });
        return bestFitness;
    }

    _sortByFitness( population, desc = 1 ) {
        return population.slice().sort((a, b) => {
            let af = a.fitnessValue; 
            let bf = b.fitnessValue;

            if ( af === bf ) {
                return 0;
            }

            return af > bf ? -desc : desc;
        });
    }

    _cleanState() {
        this._i = 0;
        this._paused = false;
        this._stopped = false;
        this._population = [];
        this._bestOne = null;
    }

    _run() {
        const {onProgress, onDone, onPause, notifyRate} = this._workerOptions;
        const notify = Boolean(onProgress);
        const maxIterations = this._options.maxIterations;

        this._createInitialPopulation();

        loop(
            () => (!this._paused && !this._isDone() && this._i < maxIterations),
            () => {
                this._i++;
                let parents = this._population.slice();

                let children = this._crossover();
                children = this._mutate(children);

                let newPopulation = this._selection([].concat(children, parents));

                this._population = this._createNewPopulation(newPopulation);

                if ( notify && this._i % notifyRate === 0 ) {
                    //TODO: bad calcs this._bestOne and this._bestFitness
                    this._getBest();
                    const percentage = this._formatFitness(this._i, maxIterations);
                    const best = this._bestOne;

                    onProgress({
                        percentage,
                        best: best.toDTO()
                    });
                }
            },
            () => {
                const populationDTO = this._snapshot(this._population, this._bestOne);

                if ( this._stopped ) {
                    onDone(populationDTO);
                } else if ( this._paused ) {
                    onPause(populationDTO);
                } else {
                    onDone(populationDTO);
                }
            }
        );
    }

    // redo with population as local var not this._population
	_run_old() {
        const {onProgress, onDone, onPause, notifyRate} = this._workerOptions;
        const notify = Boolean(onProgress);
        const maxIterations = this._options.maxIterations;

        this._createInitialPopulation();

        do {
            let parents = this._population.slice();

            let children = this._crossover();
            children = this._mutate(children);

            let newPopulation = this._selection([].concat(children, parents));

            this._population = this._createNewPopulation(newPopulation);
            this._i++;

            if ( notify && this._i % notifyRate === 0 ) {
                //TODO: bad calcs this._bestOne and this._bestFitness
                this._getBest();
                const percentage = this._formatFitness(this._i, maxIterations);
                const best = this._bestOne;

                onProgress({
                    percentage,
                    best: best.toDTO()
                });
            }

        } while ( !this._paused && !this._isDone() && this._i < maxIterations );

        const populationDTO = this._snapshot(this._population, this._bestOne);

        if ( this._paused ) {
            onPause(populationDTO);
        } else if ( onDone ) {
            onDone(populationDTO);
        }
	}

    _snapshot(currentPopulation, bestOne) {
        const population = this._sortByFitness(currentPopulation);
        if ( bestOne ) {
            population.unshift(bestOne);
        }

        // TODO: create Individual factory with preseted context
        const original = Individual.create(REFERENCE_INDIVIDUAL, null, null, false, this._context);
        population.unshift(original);
        return population.map(x => x.toDTO());
    }

    _formatFitness(iteration, maxIterations) {
        return (iteration / maxIterations * 100);
    }
}