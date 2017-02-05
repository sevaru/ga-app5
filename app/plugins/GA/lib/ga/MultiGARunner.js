import MusicContext from '../MusicContext.js';
import GAWorker from 'worker!./GAWorker.js';


/**
 * 1) Each instance should have ad ID
 * 2) Each instance should provide an message interface for sharing
 * 3) 
 */


/**
 * @class Creates GA worker instance and passes options to it.
 * Creates everytime user pushes to "run" button
 */
export class MultiGARunner {

    workers = {};
    migrationPool = [];

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

            switch (action) {
                case 'done': {
                    const population = data;
                    onProgress({ percentage: 100, best: population[1] });
                    onDone(population);
                    break;
                }

                case 'progress':
                    onProgress && onProgress({
                        percentage: data.percentage,
                        best: data.best
                    });
                    break;

                case 'pause': {
                    const population = data;
                    onPause && onPause(population);
                    break;
                }

                case 'migration': {
                    // grab 
                }
            }
        };
    }
}