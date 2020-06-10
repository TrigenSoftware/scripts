const envs = [
	require('./app'),
	require('./lib'),
	require('./jest')
];

module.exports = (env) => {

	const envOptions = envs.find(
		envOptions => envOptions.env === env
	);

	if (!envOptions) {
		throw new Error(`Unknown preset env "${env}".`);
	}

	return envOptions;
};
