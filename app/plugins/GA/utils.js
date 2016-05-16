import {OPTIONS_CHANGE_ACTION} from './actions/index';


export function createDeepProperty({ optionsPath, value }) {
	const obj = {};
	const stopIndex = optionsPath.length - 1;
	return optionsPath.reduce((prev, current, currentIndex, array) => {
		if (currentIndex === stopIndex) {
			prev[current] = value;
			return obj;
		}
		return prev[current] = {};
	}, obj);
}

export function createPluginsReducer(namespace, fullState) {
	const initialState = fullState[namespace];
	return (state = initialState, action) => {
		switch (action.type) {
			case OPTIONS_CHANGE_ACTION: {
				if (action.optionsPath[0] !== namespace) {
					return state;
				} 
				// NOTE: remove namespace from path;
				const [, ...optionsPath] = action.optionsPath;
				console.log(optionsPath)
				return Object.assign({}, state, createDeepProperty({optionsPath, value: action.value}));
			}
			default:
				return state;
		}
	};
}