import { storage } from './store/persistStorage';
import { VERSION_KEY, STATE_KEY } from './VERSION';

export function resetState() {
	storage.remove(VERSION_KEY);
	storage.remove(STATE_KEY);
	location.reload();
}