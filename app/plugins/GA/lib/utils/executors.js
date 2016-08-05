export const fitnessExecutor = 
	extractor =>
		comparer => 
			(content, reference, options = {}) => 
				comparer(
					extractor(content, options),
					extractor(reference, options),
					options
				);

export const barEqualityComparer = 
	(content, reference) => 
		reference
			.reduce((reducer, value, index) => 
				content[index] === value ?
					reducer + 1 : reducer, 0) / content.length; 

export const barContentEqualityComparer = 
	/* @params {Array<Array<number>>} content - array of bars which are GNF-like [1, 5, ...] */
	(content, reference) => 
		reference
			.reduce((reducer, value, index) => 
				reducer + barEqualityComparer(value, content[index]), 0) / content.length;
