import { maskFactory } from './helpers';
import { normalizeRhythm } from '../utils/normalization'; 

export const rhythmLineMask = maskFactory(bar => normalizeRhythm(bar));