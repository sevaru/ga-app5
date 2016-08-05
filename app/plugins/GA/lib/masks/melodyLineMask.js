import { maskFactory } from './helpers';
import { normalizeNotesDiscrete } from '../utils/normalization'; 

export const melodyLineMask = maskFactory(bar => normalizeNotesDiscrete(bar));