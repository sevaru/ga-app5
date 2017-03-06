import '../../../utils/subworker';
import { SimpleGARunner } from '../../../ga/SimpleGARunner';
import { uuid } from '../../../utils';
import { run as getFitness } from '../../../fitness/FitnessProvider';
import { Individual } from '../../../Individual';
import { EnvironmentChanger } from '../../common';
import { populationSorter } from '../../../utils/populationSorter';

const DEFAULT_NOTIFY_RATE = 10;

export class PunctuatedEquilibriumExecutor {
    _environmentChanger = new EnvironmentChanger();
    currentIteration = 0;

    /**
     * @type { [uuid: string]: SimpleGARunner }
     */
    runners = {};

    /**
     * @description Hash of runner and its current iteration.
     * @type { { [uuid: string]: number } }
     */
    iteration = {};

    /**
     * @type { { [uuid: string]: { { best: { content: Array<number>, fitness: { full: { [fitnessName: string]: value }, value: number } }, percentage: number } } } }
     */
    progressEvents = {};

    /**
     * @type { { [uuid: string]: { data: { content: Array<number> }[] } } }
     */
    pauseEvents = {};

    /**
     * @type { { [uuid: string]: { data: { content: Array<number> }[] } } }
     */
    doneEvents = {};


    /**
     * @type { [uuid: string]: boolean }
     */
    _pauseFlags = null;

    /**
     * @type { [uuid: string]: boolean }
     */
    _doneFlags = {};

    _best = null;

    /**
     * @type {Array<number[]>}
     */
    _migrants = null;

    _migrantsToSendToChilds = null;

    _currentEra = 0;

    /**
     * @param {{ options: {}, evolution: { groupsCount: number, environmentChangeWeight: number, environmentChangeRate: number, environmentDifferenceWeight: number }, crossover: {}, mutation: {}, fitness: {} }} preferences
     * @param { { onDone: Function, onProgress: Function, onPause: Function } } workerOptions
     */
    constructor(preferences, workerOptions = {}, reference, id) {
        /**
         * 
         * 1. create multiple garunners (for each group)
         * 2. how to handle many onDone, onPause, onProgress?
         * 3. store current populations .. and send new on every progress from
         * 
         * 
         * for pause use flags ?
         * 
         */

        const groupsCount = preferences.evolution.groupsCount;

        this.preferences = preferences;
        this.evolutionId = id;
        this.workerOptions = { ...workerOptions, notifyRate: DEFAULT_NOTIFY_RATE };
        this.reference = reference;

        if (this.preferences.options.migrationRate % DEFAULT_NOTIFY_RATE) {
            console.warn(`Migration rate (${this.preferences.options.migrationRate}) is not supported. Should int divided by notification rate (${DEFAULT_NOTIFY_RATE}).`)
        }

        for (let i = 0; i < groupsCount; i++) {
            this._createInstance(preferences, reference);
        }
    }

    /**
     * @description Called from GARunner on migration event
     * @params {Array<number[]>} migrants - array of migrants of type Individual.content
     */
    migrate(migrants) {
        if (!migrants || !migrants.length) {
            return;
        }
        this._migrantsToSendToChilds = this._migrantsToSendToChilds || [];
        this._migrantsToSendToChilds.push(...migrants);
    }

    stop() {
        Object
            .values(this.runners)
            .forEach(r => {
                r.stop();
                r.destroy();
            });
        this.runners = {};
        this.iteration = {};
        this.progressEvents = {};
        this._currentEra = 0;
    }

    pause() {
        this._pauseFlags =
            Object.keys(this.runners)
                .reduce((store, key) =>
                    ({
                        ...store,
                        [key]: false
                    }), {});
        Object
            .values(this.runners)
            .forEach(r => r.pause());

    }

    resume() {
        Object
            .values(this.runners)
            .forEach(r => r.resume());
    }

    _oneEra() {
        const { onMigration } = this.workerOptions;
        this._currentEra += DEFAULT_NOTIFY_RATE;
        console.log('new era', this._currentEra);

        if (onMigration && this._migrants && this._currentEra % this.preferences.options.migrationRate === 0) {
            console.log('migration from PunctuatedEquilibriumExecutor');
            onMigration({
                id: this.evolutionId,
                migrants: this._migrants
            });
            this._migrants = null;
        }
    }

    _createInstance(rootOptions, reference) {
        const id = uuid();
        const options = this._createInstanceOptions(rootOptions);

        const instanceWorkerOptions = {
            onDone: e => this._onInstanceDone(e, id),
            onProgress: e => this._onInstanceProgress(e, id),

            /**
             * @param { { data: { content: Array<number> }[] } } e
             */
            onPause: e => this._onInstancePause(e, id)
        };

        const instance = new SimpleGARunner(options, instanceWorkerOptions, reference, migrants => this._onMigrationFromInstances(migrants));
        this.progressEvents[id] = null;
        this.iteration[id] = 0;
        this.runners[id] = instance;
        this._doneFlags[id] = false;
    }

    _onMigrationFromInstances(migrants) {
        this._migrants = this._migrants || [];
        this._migrants.push(...migrants);
        const migrantsToSend = this._migrantsToSendToChilds;
        this._migrantsToSendToChilds = null;
        return migrantsToSend;
    }

    _onInstanceDone(e, subId) {
        this.doneEvents[subId] = e;
        this._doneFlags[subId] = true;

        if (Object.values(this._doneFlags).some(x => !x)) {
            return;
        }

        const event = this._getSnapshotEvent(this.doneEvents);
        this.workerOptions.onDone({
            id: this.evolutionId,
            ...event
        });
        this._doneFlags = {};
    }

    /**
     * 
     * @param { { best: { content: Array<number>, fitness: { full: { [fitnessName: string]: value }, value: number } }, percentage: number } } e 
     * @param {string} subId 
     */
    _onInstanceProgress(e, subId) {
        this.iteration[subId] += 1;
        this.progressEvents[subId] = e;

        if (this.currentIteration >= this._getMinIteration()) {
            return;
        }

        this._oneEra();
        this.currentIteration += 1;

        const event = this._getCurrentIterationEvent();
        if (!event) {
            return;
        }

        this.workerOptions.onProgress({
            ...event,
            id: this.evolutionId
        });
    }

    /**
     * @param { { data: { content: Array<number> }[] } } e
     * @param {string} subId
     */
    _onInstancePause(e, subId) {
        this.pauseEvents[subId] = e;
        this._pauseFlags[subId] = true;

        if (Object.values(this._pauseFlags).some(x => !x)) {
            return;
        }

        const event = this._getSnapshotEvent(this.pauseEvents);
        this.workerOptions.onPause({
            id: this.evolutionId,
            ...event
        });
        this._pauseFlags = {};
    }

    _getSnapshotEvent(events) {
        // NOTE: population snapshot contains original reference as a first element
        let original;
        const raw =
            Object
                .values(events)
                .filter(x => x)
                .reduce((store, { data }) => {
                    original = data.shift();
                    return [...store, ...data.map(({ content }) => content)];
                }, []);

        const { fitness } = this.preferences;
        const context = {
            fitness: getFitness(fitness)
        };

        // 2. Recreate and sort population;
        /**
         * @type {Array<{ content: Array[number], fitness: { value: number } }>}
         */
        const individuals = populationSorter(raw.map(x => new Individual(this.reference, x, null, false, context))).map(x => x.toFullFitnessDTO());
        individuals.unshift(original);

        return {
            data: individuals
        };
    }

    _getCurrentIterationEvent() {
        const { fitness } = this.preferences;

        const context = {
            fitness: getFitness(fitness)
        };

        /**
         * @type { { best: { content: Array<number>, fitness: { full: { [fitnessName: string]: value }, value: number } }, percentage: number }[] }
         */
        const events = Object.values(this.progressEvents).filter(x => x);
        const percentage = events.reduce((value, { percentage }) => percentage > value ? value : percentage, events[0].percentage);

        // NOTE: for the end we don't wanna have two 100 points on graph so we wait for done
        if (percentage === 100) {
            return null;
        }

        const bestGuys = events
            .map(event =>
                new Individual(this.reference, event.best.content, null, false, context));

        if (!this._best) {
            this._best = bestGuys[0];
        }

        const best =
            bestGuys.reduce((bestOne, individual) => bestOne.fitnessValue > individual.fitnessValue ? bestOne : individual, bestGuys[0]);

        if (best.fitnessValue > this._best.fitnessValue) {
            this._best = best;
        }

        return {
            best: this._best.toFullFitnessDTO(),
            percentage
        };
    }

    /**
     * @param {{ options: {}, evolution: { groupsCount: number, environmentChangeWeight: number, environmentChangeRate: number, environmentDifferenceWeight: number }, crossover: {}, mutation: {}, fitness: {} }} rootOptions
     */
    _createInstanceOptions(rootOptions) {
        const { evolution: { environmentDifferenceWeight, groupsCount }, options: { count } } = rootOptions;
        const oneGroupCount = Math.floor(count / groupsCount);
        return {
            ...this._environmentChanger.fluctuateOptions(rootOptions, environmentDifferenceWeight),
            options: {
                ...rootOptions.options,
                count: oneGroupCount
            }
        };
    }

    _getMinIteration() {
        return Math.min(...Object.values(this.iteration));
    }
}