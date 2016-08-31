export const storage = {
	get(key) {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch (e) {
			return undefined;
		}
	},
	set(key, value) {
		try {
			return localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			return undefined;
		}
	},
	remove(key) {
		try {
			return localStorage.removeItem(key);
		} catch (e) {
			return undefined;
		}
	}
};