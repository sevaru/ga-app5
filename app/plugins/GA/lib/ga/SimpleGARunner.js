import MusicContext from '../MusicContext.js';
import GAWorker from 'worker!./SimpleGAWorker.js';

/**
 * @description TODO: merge with GARunner
 */
export class SimpleGARunner {
    /**
     * @type {Worker}
     */
    _worker;

    /**
     * @param { Object } options
     * @param { { onDone: Function, onProgress: Function, onPause: Function } } workerOptions
     */
    constructor(options, workerOptions) {
        const reference = MusicContext.getCurrentComposition();
        this._setupDefault(options, workerOptions, reference);
    }

    /**
    * @param { Object } options
     * @param { { onDone: Function, onProgress: Function, onPause: Function } } workerOptions
     * @param {*} reference 
     */
    _setupDefault(options, workerOptions, reference) {
        this._worker = new GAWorker();
        this._worker.onmessage = this._createOnMessage(workerOptions);
        this._worker.onerror = err => console.warn(err);
        this._worker.postMessage({ data: { options, reference }, action: 'start' });
    }

    pause() {
        this._worker.postMessage({ action: 'pause' });
    }

    resume() {
        this._worker.postMessage({ action: 'resume' });
    }

    stop() {
        this._worker.postMessage({ action: 'stop' });
    }

    destroy() {
        this._worker.terminate();
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
}