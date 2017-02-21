import '../../../../polyfills';
import { plugins } from '../evolution/EvolutionProvider';

const USER_REQUEST_EVENTS = {
	START: 'start',
	STOP: 'stop',
	PAUSE: 'pause',
	RESUME: 'resume'
};

/**
 * @param { { evolution: any } } options
 * @param { Array<number> } reference
 * @param { string } id - worker identifier
 */
function createGA(options, reference, id, evolutionName = 'darwin-evolution') {
	const { executor } = plugins[evolutionName];
	const instanceOptions = {
		...options,
		evolution: options.evolution[evolutionName]
	};

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



	const onMigration =
		data => {
			postMessage({
				data,
				action: 'migrate'
			});
		};

	const workerOptions = {
		onProgress,
		onDone,
		onPause,
		/**
		 * @description Called in GA when migration needed
		 */
		onMigration,

	};

	return new executor(instanceOptions, workerOptions, reference, id);
}

let gaInstance;

onmessage = function (event/*: { data: { action: 'start' | 'stop' | 'pause', data: any } } */) { // eslint-disable-line
	const { data: { options, reference, migrants, id, evolutionName } = {}, action } = event.data;

	console.log(event);

	switch (action) {
		case USER_REQUEST_EVENTS.START:
			// TODO: use evolutionName to grab evolution executor from EvolutionProvider
			gaInstance = createGA(options, reference, id, evolutionName);
			break;

		case USER_REQUEST_EVENTS.STOP:
			gaInstance.stop();
			// TODO: creepy way to let websocket send message on onDone back and only than close socket; 
			setTimeout(close, 100);
			break;

		case USER_REQUEST_EVENTS.PAUSE:
			gaInstance.pause();
			break;

		case USER_REQUEST_EVENTS.RESUME:
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