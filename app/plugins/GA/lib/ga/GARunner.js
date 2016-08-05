import Individual from '../Individual.js';
import MusicContext from '../MusicContext.js';
import GAWorker from 'worker!./GAWorker.js';




/**
 * @class Creates GA worker instance and passes options to it.
 * Creates everytime user pushes to "run" button
 */
export default class GARunner {
	constructor(options, onDone, onProgress, onPause) {
        const reference = MusicContext.getCurrentComposition();
        this._worker = new GAWorker();
        this._worker.onmessage = this._createOnMessage(onDone, onProgress, onPause);
        this._worker.postMessage({ data: { options, reference }, action: 'start' });
        this._worker.onerror = (err) => {
            console.warn(err);
        };
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

    _createOnMessage(onDone, onProgress, onPause) {
        return ({ data: { data, action } }) => {
            console.log(`onmessage from worker ${action}`);
            // TODO: Symbol('done');
            if ( action === 'done') {
                const population = data.map(obj => Individual.fromDTO(obj));
                onProgress({ percentage: 100, best: population[1] });
                onDone(population);
                return;
            }

            // TODO: Symbol('process');
            if ( onProgress && action === 'progress') {
                onProgress({
                    percentage: data.percentage,
                    best: Individual.fromDTO(data.best)
                });
            }

            // TODO: Symbol('pause');
            if ( onPause && action === 'pause' ) {
                const population = data.map(obj => Individual.fromDTO(obj));
                onPause(population);
            }
        };
    }
}