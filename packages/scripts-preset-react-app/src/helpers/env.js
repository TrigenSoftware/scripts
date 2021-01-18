
export function getConfigFromEnv(name, defaultsOrMutator) {
	const envConfig = JSON.parse(process.env[name] || '{}');

	if (typeof defaultsOrMutator === 'function') {
		return defaultsOrMutator(envConfig);
	}

	return {
		...defaultsOrMutator,
		...envConfig
	};
}

export function getParamFromEnv(name, defaults) {
	try {
		return JSON.parse(process.env[name]);
	} catch (err) {
		return defaults;
	}
}
