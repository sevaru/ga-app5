export default function loop(condition, body, done) {
	body();

	if (!condition()) {
		done();
		return;
	}

	setTimeout(() => loop(condition, body, done), 0);
}

/*
TODO: use some sort of co to run this generator
function late(fn) {
	return new Promise(resolve => {
		setTimeout(() => resolve(fn()), 0);
	});
}

export function* asyncLoop(expr) {
	let done = false;

	while (!done) {
		done = yield late(expr);
	}
}
*/
