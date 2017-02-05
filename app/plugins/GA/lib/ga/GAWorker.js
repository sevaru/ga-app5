import '../../../../polyfills';
import { BrowserGA } from './GA.js';

/*
interface IWorkerOptions {
    onProgress: (percentage: number) => void;
    onDone: (population: Array<Individuals>) => void;
    progressRate: number;
}
interface IEventData {
	options: IGAOptions;
	workerOptions: IWorkerOptions;
}

interface IEvent {
	data: IEventData
}
*/

function createGA(options, reference) {
	const onProgress =
		data => 
			postMessage({
				data,
				action: 'progress'
			});

	const onPause = 
		data =>
			postMessage({
				data,
				action: 'pause'
			});

	const onDone = 
		data => {
			postMessage({
				data,
				action: 'done'
			});
			close();
		};

	return new BrowserGA(options, { onProgress, onDone, onPause }, reference);
}

let gaInstance;

onmessage = function(event/*: { data: { action: 'start' | 'stop' | 'pause', data: any } } */) { // eslint-disable-line
	const { data: { options, reference, migrants } = {}, action } = event.data;

	console.log(action);
	switch ( action ) {
		case 'start':
			gaInstance = createGA(options, reference);
			break;

		case 'stop':
			gaInstance.stop();
			// TODO: creepy way to let websocket send message on onDone back and only than close socket; 
			setTimeout(close, 100);
			break;

		case 'pause':
			gaInstance.pause();
			break;

		case 'resume':
			gaInstance.resume();
			break;

		case 'migrate':
			if (migrants && gaInstance.migrate) {
				gaInstance.migrate(migrants);
			}
			break;

		default:
			throw `Unknown action ${action}`;
	}
};