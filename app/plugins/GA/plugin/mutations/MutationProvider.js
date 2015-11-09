import { arrayUtils, selectionUtils } from '../utils.js';

//Runtime
import swap2 from './swap2.js'; 
import upAndDown from './upAndDown.js';
import changeDuration from './changeDuration.js';

class MutationProvider {
	constructor() {
		this._options = undefined;
		this._hash = {
			swap2: swap2.mutate.bind(swap2),
			upAndDown: upAndDown.mutate.bind(upAndDown),
			changeDuration: changeDuration.mutate.bind(changeDuration)
		};
	}

	setOptions(options) {
		this._options = options;
	}

	mutate(content) {
		const { mutation, options } = this._getMutation();
		return mutation(content, options);
	}

	_getMutation() {
		const key = selectionUtils.getRandomKeyByWeight(this._options);
		const mutation = this._hash[key]; 
		const options = this._options[key];
		return { mutation, options };
	}
}

export default new MutationProvider();