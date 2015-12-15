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

onmessage = function(event) {
	const options = event.data;

	const onProgress = percentage => {
		postMessage({
			action: 'progress',
			data: percentage
		});
	};

	const onDone = population => {
		postMessage({
			action: 'done',
			data: population
		});
	};

	let instance = new GA(options, { onProgress, onDone });
};