export const OPTIONS_CHANGE_ACTION = 'optionsChangeAction';

export function changeOptions(optionsPath, value) {
	console.log(optionsPath);
	return {
		type: OPTIONS_CHANGE_ACTION,
		optionsPath,
		value
	};
}