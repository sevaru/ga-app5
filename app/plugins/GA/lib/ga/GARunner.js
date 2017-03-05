import MusicContext from '../MusicContext.js';
import GAWorker from 'worker!./GAWorker.js';
import { uuid, arrayUtils } from '../utils';
import { remove } from 'lodash';

/**
 * @class Creates GA worker instance and passes options to it.
 * Creates everytime user pushes to "run" button
 */
export class GARunner {
    workersPool = {};

    /**
     * @type {Array<number[]>} - an array of Individuals content
     */
    migrationPool = [];
    _useEvolutionStrategies = false;

    /**
     * @type {Worker}
     */
    _worker;

    /**
     * @param { { useEvolutionStrategies: boolean } } options
     * @param { { onDone: Function, onProgress: Function, onPause: Function } } workerOptions
     */
    constructor(options, workerOptions) {
        const reference = MusicContext.getCurrentComposition();
        const evolution = options.evolution;
        this._useEvolutionStrategies = options.options.useEvolutionStrategies;

        if (this._useEvolutionStrategies) {
            this._setupEvolutions(evolution, options, workerOptions, reference);
        } else {
            this._setupDefault(options, workerOptions, reference);
        }
    }

    _setupEvolutions(evolution, options, workerOptions, reference) {
        // 1. Determine which evolution is used
        const { migrationSize } = options.options;

        const availableEvolutions =
            Object
                .entries(evolution)
                .filter(([_, evolutionOptions]) => {
                    return evolutionOptions.weight > 0;
                });


        const max = availableEvolutions.reduce((sum, [_, { weight }]) => sum + weight, 0);

        const normalizedPopulation =
            availableEvolutions.map(
                ([name, evolutionOptions]) => {
                    return [
                        name,
                        {
                            ...evolutionOptions,
                            size: Math.floor(migrationSize * evolutionOptions.weight / max)
                        },
                    ]
                }
            );


        // 3. onmessage should consider worker key?
        // 4. GAWorker should consider GAEvolutionModel as a string key?


        // TODO: how to deal with EvolutionOptions.weight??? 
        // This should be used as migration cound multiplier?
        normalizedPopulation
            .forEach(([evolutionName, evolutionOptions]) => {
                const randomKey = `${evolutionName}_${uuid()}`;
                const worker = this.workersPool[randomKey] = new GAWorker();
                worker.onmessage = this._createOnMessageForEvolution(workerOptions, evolutionOptions, worker, evolutionName);
                worker.onerror = err => console.warn(err);

                worker.postMessage({
                    data: {
                        options: {
                            ...options,
                            // NOTE: Change population size according to weight 
                            count: evolutionOptions.size
                        },
                        reference,
                        id: randomKey,
                        evolutionName
                    },
                    action: 'start'
                });
            });
    }

    _setupDefault(options, workerOptions, reference) {
        this._worker = new GAWorker();
        this._worker.onmessage = this._createOnMessage(workerOptions);
        this._worker.onerror = err => console.warn(err);
        this._worker.postMessage({ data: { options, reference }, action: 'start' });
    }

    pause() {
        if (this._useEvolutionStrategies) {
            // TODO: do i need id to pass to pause?
            Object.values(this.workersPool).forEach(w => w.postMessage({ action: 'pause' }));
        } else {
            this._worker.postMessage({ action: 'pause' });
        }
    }

    resume() {
        if (this._useEvolutionStrategies) {
            // TODO: do i need id to pass to resume?
            Object.values(this.workersPool).forEach(w => w.postMessage({ action: 'resume' }));
        } else {
            this._worker.postMessage({ action: 'resume' });
        }
    }

    stop() {
        if (this._useEvolutionStrategies) {
            // TODO: do i need id to pass to stop?
            Object.values(this.workersPool).forEach(w => w.postMessage({ action: 'stop' }));
        } else {
            this._worker.postMessage({ action: 'stop' });
        }
    }

    destroy() {
        if (this._useEvolutionStrategies) {
            Object.values(this.workersPool).forEach(w => w.terminate());
            this.workersPool = {};
        } else {
            this._worker.terminate();
        }
    }

    _createOnMessageForEvolution({ onDone, onProgress, onPause }, evolutionOptions, instance, evolutionName) {
        return ({ data: { data, action } }) => {
            console.log(`Evolutions: onmessage from worker ${evolutionName}, ${action}`);

            if (action === 'done') {
                const population = data.data;
                onProgress({
                    id: data.id,
                    percentage: 100,
                    best: population[1]
                });
                onDone(data);
                return;
            }

            if (onProgress && action === 'progress') {
                onProgress({
                    id: data.id,
                    percentage: data.percentage,
                    best: data.best
                });
            }

            if (onPause && action === 'pause') {
                onPause(data);
            }

            if (action === 'migrate') {
                const { migrants, id } = data;

                // Send migrants back
                const migrantsToSend = this._getMigrants(migrants.length);
                if (migrantsToSend) {
                    instance.postMessage({
                        action: 'migrate',
                        data: { migrants: migrantsToSend }
                    });
                }

                // Store received migrants
                this.migrationPool.push(...migrants);
            }
        };
    }

    _createOnMessage({ onDone, onProgress, onPause }) {
        return ({ data: { data, action } }) => {
            console.log(`onmessage from worker ${action}`);

            if (action === 'done') {
                const population = data.data;
                onProgress({ percentage: 100, best: population[1] });
                onDone(data);
                return;
            }

            if (onProgress && action === 'progress') {
                onProgress({
                    percentage: data.percentage,
                    best: data.best
                });
            }

            if (onPause && action === 'pause') {
                onPause(data);
            }
        };
    }

    /**
     * @description Grab random migrants from pool.
     * NOTE! it could even be previous migrants from this exact evolution
     * @param {number} count 
     */
    _getMigrants(count) {
        console.log(this.migrationPool.length);
        const indexes = arrayUtils.getRandomIndexes(count, this.migrationPool.length);
        const result = indexes.map(i => this.migrationPool[i]);
        remove(this.migrationPool, (_, index) => indexes.includes(index));
        console.log(this.migrationPool.length);
        return result;
    }
}