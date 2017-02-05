import '../../../../polyfills';
import MusicContext from '../MusicContext.js';
import GAWorker from 'worker!./GAWorker.js';


// Params -> migrationRate (in eras), migration size
// 1. Pool of GAs
// 2. Box of migrants


function createWorkerInstance() {
    const reference = MusicContext.getCurrentComposition();
    const worker = new GAWorker();
    worker.onmessage = this._createOnMessage(onDone, onProgress, onPause);
    worker.postMessage({ data: { options, reference }, action: 'start' });
    worker.onerror = (err) => console.warn(err);
}


const migrationBox = [];

self.addEventListener('message', (e) => {

});
