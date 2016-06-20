export const OPTIONS_CHANGE_ACTION = 'optionsChangeAction';

export function changeOptions(optionsPath, value) {
	return {
		type: OPTIONS_CHANGE_ACTION,
		optionsPath,
		value
	};
}