import '../../../../polyfills';
import { plugins } from '../evolution/EvolutionProvider';
import { createOnMessageEvolution } from './worker/createOnMessage';

self.addEventListener('message', createOnMessageEvolution(plugins), false);