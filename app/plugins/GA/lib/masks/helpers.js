import Composition from '../utils/Composition';

export const maskFactory = 
	barAnalyzer => 
		(data, options) => 
			Composition
				.create(data)
				.rawBars()
				.map(bar => barAnalyzer(bar, options));