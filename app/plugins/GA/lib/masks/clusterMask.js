import { PAUSE } from '../MusicContext';
import { maskFactory } from './helpers';

const DEFAULT_THRESHOLD = 0.5;

export const clusterMask = 
	maskFactory((bar, { threshold = DEFAULT_THRESHOLD } = {}) => 
		bar.reduce((reducer, value) =>
	 		reducer + value === PAUSE ? 0 : 1, 0) / bar.length);