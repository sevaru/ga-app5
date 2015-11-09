import { arrayUtils } from '../utils.js';

const defaultOptions = {
	count: 64
};

class Swap2Mutation {
	mutate( data, options = {} ) {
		options = Object.assign({}, defaultOptions, options);

		arrayUtils
			// -1 cause we need neighbor
			.getRandomIndexes(options.count, data.length - 1)
			.forEach(i => {
				const temp = data[i];
				data[i] = data[i + 1];
				data[i + 1] = temp;
			});
		
		return data;
	}
}

export default new Swap2Mutation();