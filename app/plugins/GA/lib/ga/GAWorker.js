import '../../../../polyfills';
import GA from './GA.js';

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

// Сейчас на каждый мессадж создается новый GA
// Требуется поправить так, чтобы GA создавался только по мере надобности 
//
// 1) Start
// 2) Stop
// 3) Pause
// 4) Resume

function createGA(options) {
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

	return new GA(options, { onProgress, onDone, onPause });
}

let sharedInstance;

onmessage = function(event/*: { data: { action: 'start' | 'stop' | 'pause', data: any } } */) { // eslint-disable-line
	const { data, action } = event.data;

	console.log(action);
	switch ( action ) {
		case 'start':
			sharedInstance = createGA(data);
			break;

		case 'stop':
			sharedInstance.stop();
			// TODO: creepy way to let websocket send message on onDone back and only than close socket; 
			setTimeout(close, 100);
			break;

		case 'pause':
			sharedInstance.pause();
			break;

		case 'resume':
			sharedInstance.resume();
			break;

		default:
			throw `Unknown action ${action}`;
	}
};