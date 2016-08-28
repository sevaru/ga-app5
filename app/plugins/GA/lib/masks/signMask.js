import { PAUSE } from '../MusicContext';
import { maskFactory } from './helpers';

export const signMask = 
	maskFactory(bar => 
		bar.reduce((reducer, value) => {

			

			return {
				prev: value,
				data: []
			};

		}, { data: [], prev: null })
	);