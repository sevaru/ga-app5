import '../../../../polyfills';
import { createOnMessageSimple } from './worker/createOnMessage';

self.addEventListener('message', createOnMessageSimple(), false);