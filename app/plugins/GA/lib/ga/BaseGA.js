import Individual from '../Individual';
import { sampleSize } from 'lodash';
import { run as getCrossover } from '../crossovers/CrossoverProvider';
import { run as getMutation } from '../mutations/MutationProvider';
import { run as getFitness } from '../fitness/FitnessProvider';

const defaultWorkerOptions = {
    onProgress: undefined,
    onDone: undefined,
    onPause: undefined,
    notifyRate: 10,

    onMigration: undefined,
    migrationRate: undefined,
    migrationCount: 10
};

export class BaseGA {
    _context;
    _options;

    /**
     * @type {Array<Individual> | null}
     */
    _migrants = null;

    /**
     * @type {{ options: {}, evolution: {}, crossover: {}, mutation: {}, fitness: {} }}
     */
    _preference;

    /**
     * @param {{ options: {}, evolution: {}, crossover: {}, mutation: {}, fitness: {} }} preferences
     */
    constructor(preferences, workerOptions = {}, reference, id) {
        const { crossover, mutation, fitness, options, evolution } = preferences;
        this._id = id;
        // -1) Grab selected reference
        this._reference = reference;

        // 0) Grab and store options
        this._preference = preferences;
        this._options = options;
        this._evolution = evolution;
        this._workerOptions = Object.assign({}, defaultWorkerOptions, workerOptions);

        // 1) Create context for individuals
        this._context = {
            crossover: getCrossover(crossover),
            mutation: getMutation(mutation),
            fitness: getFitness(fitness)
        };

        // 2) Set current state variables
        this._cleanState();

        // 3) Perform initial run
        this._run();
    }

    /**
     * @description Called from GARunner on migration event
     * @params {Array<number[]>} migrants - array of migrants of type Individual.content
     */
    migrate(migrants) {
        this._migrants = migrants.map(x => 
            new Individual(this._reference, x, null, false, this._context));
    }

    resume() {
        this._paused = false;
        this._run();
    }

    pause() {
        this._paused = true;
    }

    stop() {
        this._paused = true;
        this._stopped = true;
    }


    //-----------------------------
    //  1. Initial Population
    //-----------------------------
    _createInitialPopulation() {
        this._population = [];

        for (var i = 0; i < this._options.count; i++) {
            this._population.push(
                new Individual(this._reference, null, null, this._options.useRandomInitialIndividuals, this._context)
            );
        }
    }

    //-----------------------------
    //  2. Mutate/Crossover
    //-----------------------------
    _crossover() {
        const result = [];
        const clones = this._sortByFitness(this._population.slice());

        while (clones.length > 2) {
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
            if (Math.random() < probability) {
                item.mutate();
            }
            return item;
        });
    }

    //-----------------------------
    //  3. Selection
    //-----------------------------
    _removeClones(population) {
        return Object
            .values(
            population.reduce((reducer, item) =>
                ({ ...reducer, [item.getHash()]: item }), {}));
    }
    _selection(newPopulation) {
        const { deathLimit, stopOnEndOfIterations, countOfBestToLiveThrought: count } = this._options;

        let goodGuys = this._removeClones(newPopulation).filter(item => item.fitnessValue > deathLimit);

        // TODO: it's variations i guess
        if (stopOnEndOfIterations) {
            goodGuys = goodGuys.filter(({ fitnessValue }) => fitnessValue !== 1);
        }

        /*
        Если порог прохождения никто не прошел
        И установлено количество_выживающих_без_учета_фитнеса
        То берем ровно столько лучших возможных, сколько не хватает
         */
        if (count && goodGuys.length < count) {
            const bestWeHave = this._getBestWeHave(count, goodGuys.length, newPopulation);
            goodGuys = [...goodGuys, ...bestWeHave];
        }

        return goodGuys;
    }

    // PURE
    // USE: _sortByFitness
    _getBestWeHave(countWeNeed, countWeHave, currentPopulation) {
        const result = [];
        const population = this._sortByFitness(currentPopulation);

        for (let i = countWeHave; i < countWeNeed; i++) {
            result.push(population[i]);
        }
        return result;
    }

    /**
     * @description 4. Creates sorted by fitness population 
     * @param { Array<Individual> } newPopulation
     * @returns { Array<Individual> }
     */
    _createNewPopulation(newPopulation) {
        const population = newPopulation.slice();
        const need = this._options.count - population.length;

        // if we need more guys
        if (need > 0) {
            for (var i = 0; i < need; i++) {
                population.push(new Individual(this._reference, null, null, this._options.useRandomInitialIndividuals, this._context));
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
        if (!this._bestOne) {
            this._bestOne = population[0];
        }
        let bestFitness = this._bestOne ? this._bestOne.fitnessValue : 0;
        population.forEach(item => {
            if (item.fitnessValue > bestFitness) {
                bestFitness = item.fitnessValue;
                this._bestOne = item;
            }
        });
        return bestFitness;
    }

    _sortByFitness(population, desc = 1) {
        return population.slice().sort((a, b) => {
            const af = a.fitnessValue;
            const bf = b.fitnessValue;

            if (af === bf) {
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
        this._createInitialPopulation();
        this._loop(
            () => this._needToRun(),
            () => this._oneEra(),
            () => this._onCompletion()
        );
    }

    /**
     * @description 1. Condition to run GA loop
     */
    _needToRun() {
        const { maxIterations, stopOnEndOfIterations } = this._options;
        return (stopOnEndOfIterations || !this._isDone()) &&
            !this._paused &&
            this._i < maxIterations
    }

    /**
     * @description 2. GA loop algorithm one iteration's body
     */
    _oneEra() {
        this._i++;
        const parents = this._population.slice();

        if (this._migrants) {
            parents.push(...this._migrants);
            this._migrants = null;
        }

        const children = this._mutate(this._crossover());
        const newPopulation = this._selection([...children, ...parents]);
        this._population = this._createNewPopulation(newPopulation);
        this._notificationProcess();
        this._migrationProcess();
    }

    /**
     * @description 3. GA completion logic
     */
    _onCompletion() {
        const { onPause, onDone } = this._workerOptions;

        const populationDTO = this._snapshot(this._population);

        if (this._stopped) {
            onDone({
                id: this._id,
                data: populationDTO
            });
        } else if (this._paused) {
            onPause({
                id: this._id,
                data: populationDTO
            });
        } else {
            onDone({
                id: this._id,
                data: populationDTO
            });
        }
    }

    _notificationProcess() {
        const { onProgress, notifyRate } = this._workerOptions;
        const { maxIterations } = this._options;
        const notify = Boolean(onProgress);

        if (notify && this._i % notifyRate === 0) {
            //TODO: bad calcs this._bestOne and this._bestFitness
            this._getBest();
            const percentage = this._formatFitness(this._i, maxIterations);

            onProgress({
                id: this._id,
                percentage,
                best: this._bestOne.toFullFitnessDTO()
            });
        }
    }

    _migrationProcess() {
        const { onMigration } = this._workerOptions;
        const { migrationRate } = this._options;
        if (!migrationRate) {
            return;
        }

        if (onMigration && this._i % migrationRate === 0) {
            onMigration({
                id: this._id,
                migrants: this._getMigrants()
            });
        }
    }

    /**
     * @returns {Array<number[]>} - array of Individual contents
     */
    _getMigrants() {
        const { migrationSize, count } = this._options;
        const migrantsCount = (count * migrationSize) | 0;
        return migrantsCount ? sampleSize(this._population, migrantsCount).map(x => x.content) : [];
    }

    _snapshot(currentPopulation) {
        const population = this._sortByFitness(currentPopulation);
        // TODO: create Individual factory with preseted context
        const original = new Individual(this._reference, null, null, false, this._context);
        population.unshift(original);
        return population.map(x => x.toFullFitnessDTO());
    }

    _formatFitness(iteration, maxIterations) {
        return (iteration / maxIterations * 100);
    }
    _loop(/* cond, body, done */) {
        throw new Error('Abstract GA class');
    }

    /**
     * @param {number} rate - integer
     */
    _isOccur(rate) {
        return this._i % rate === 0;
    }
}