export function createPluginsHash(context) {
	return context
				.keys()
				.map((key) => context(key).default)
				.reduce((hash, value) => {
					if (!value.getInitialState) {
						value.getInitialState = () => ({});
					}
					hash[value.name] = value;
					return hash;
				}, {});
}