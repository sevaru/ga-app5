export  function loop(condition, body, done) {
	body();

	if (!condition()) {
		done();
		return;
	}

	setTimeout(() => loop(condition, body, done), 0);
}

/**
 * @param {Function} condition
 * @param {Function} body
 * @param {Function} done
 * @param {number} defaultRate
 * @param {number} currentRate
 */
export function debounceLoop(condition, body, done, defaultRate = 1000, currentRate = defaultRate) {
	body();

	if (!condition()) {
		done();
		return;
	}

	if (currentRate === 0) {
		setTimeout(() => debounceLoop(condition, body, done, defaultRate, defaultRate), 0);
		return;
	}

	debounceLoop(condition, body, done, defaultRate, --currentRate);
}

export function syncLoop(condition, body, done) {
	while(condition()) {
		body();
	}

	done();
}