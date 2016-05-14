export default function loop(condition, body, done) {
	body();

	if (!condition()) {
		done();
		return;
	}

	setTimeout(() => loop(condition, body, done), 0);
}