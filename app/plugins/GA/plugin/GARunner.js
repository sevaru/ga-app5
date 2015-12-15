import Individual from '../plugin/Individual.js';
import GAWorker from 'worker!../plugin/GAWorker.js';

export default class GARunner {
	constructor(options, onDone, onProgress = null) {
        const worker = new GAWorker();
        worker.onmessage = ({ data: { data, action } }) => {
            if ( action === 'done' /*Symbol('done')*/) {
                const population = data.map(obj => Individual.fromDTO(obj));
                onProgress(100);
                onDone(population);
            } else if ( onProgress && action === 'progress') {
                onProgress(data); //percentage
            }

        };
        worker.postMessage(options);
    }
}