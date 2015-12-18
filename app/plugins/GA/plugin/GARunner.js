import Individual from '../plugin/Individual.js';
import GAWorker from 'worker!../plugin/GAWorker.js';

export default class GARunner {
	constructor(options, onDone, onProgress = null) {
        this._worker = new GAWorker();
        this._worker.onmessage = ({ data: { data, action } }) => {
            if ( action === 'done' /*Symbol('done')*/) {
                const population = data.map(obj => Individual.fromDTO(obj));
                onProgress({ percentage: 100, best: population[1] });
                onDone(population);
            } else if ( onProgress && action === 'progress') {
                onProgress({
                    percentage: data.percentage,
                    best: Individual.fromDTO(data.best)
                }); //{ percentage, best }
            }

        };
        this._worker.postMessage(options);
    }

    destroy() {
        this._worker.terminate();
    }
}