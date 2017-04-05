/**
 * @param { { evolution: any } } options
 * @param { Array<number> } reference
 * @param { string } id - worker identifier
 * @param { { new() } } executor
 * @param { string } evolutionName
 */
export function createGA(options, reference, id, executor, evolutionName = 'darwin-evolution') {
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
		onMigration
	};

	return new executor(instanceOptions, workerOptions, reference, id);
}