
const mock = new Proxy(() => mock, {
	get(_, key) {
		if (key === 'toString') {
			return () => 'mock';
		}

		return mock;
	}
});

module.exports = mock;
