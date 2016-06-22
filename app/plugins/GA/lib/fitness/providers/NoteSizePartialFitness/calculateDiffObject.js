export const calculateDiffObject = (barA, barB) =>
	Object
		.keys(barB)
		.map(key => ({ key, value: barB[key] }))	
		.reduce(( diff, { key, value }) => {
			if ( diff[key] != null ) {
				const difference = diff[key] - value;
				diff[key] = difference > 0 ? difference : 0;
			}
			return diff;
		}, { ...barA });
