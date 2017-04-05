/**
 * @param {Array<{name: string, getInitialState: Function}>} context;
 */
export const createPluginsHash = 
	(context) => context
		.reduce((hash, value) => {
			if (!value.getInitialState) {
				value.getInitialState = () => ({});
			}
			hash[value.name] = value;
			return hash;
		}, {});