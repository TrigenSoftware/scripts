function isCommonJS(api, defaults) {

	const supportsStaticESM = api.caller(({
		supportsStaticESM
	}) => supportsStaticESM);

	return typeof supportsStaticESM === 'undefined'
		? defaults
		: !supportsStaticESM;
}

module.exports = (api, envOptions, options) => {

	const {
		targets,
		useBuiltIns,
		corejs,
		commonjs,
		typescript,
		react,
		transformDynamicImport,
		transformRuntime,
		requireContextHook,
		reactConstantElements,
		reactRemovePropTypes: inputReactRemovePropTypes
	} = {
		targets: false,
		useBuiltIns: 'usage',
		corejs: 3,
		commonjs: isCommonJS(api, false),
		typescript: false,
		react: false,
		transformDynamicImport: false,
		transformRuntime: false,
		requireContextHook: false,
		reactConstantElements: {},
		reactRemovePropTypes: {},
		...envOptions,
		...options
	};
	const reactRemovePropTypes = {
		removeImport: typeof inputReactRemovePropTypes.mode === 'undefined'
			|| inputReactRemovePropTypes.mode === 'remove',
		ignoreFilenames: ['node_modules'],
		...inputReactRemovePropTypes
	};
	const presetEnvOptions = {};
	const transformRuntimeOptions = {
		useESModules: false
	};
	const presets = [
		['@babel/preset-env', presetEnvOptions]
	];
	const plugins = [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-syntax-import-meta',
		['@babel/plugin-proposal-decorators', {
			legacy: true
		}],
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-json-strings',
		'@babel/plugin-proposal-function-sent',
		'@babel/plugin-proposal-export-namespace-from',
		'@babel/plugin-proposal-numeric-separator',
		'@babel/plugin-proposal-throw-expressions',
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-async-generator-functions',
		['@babel/plugin-transform-runtime', transformRuntimeOptions]
	];

	if (transformRuntime) {
		transformRuntimeOptions.corejs = corejs;
	} else {
		presetEnvOptions.useBuiltIns = useBuiltIns;
		presetEnvOptions.corejs = corejs;

		plugins.push([
			'babel-plugin-transform-remove-imports',
			{
				test: /^regenerator-runtime\/runtime/
			}
		]);
	}

	if (targets) {
		presetEnvOptions.targets = targets;
	}

	if (!commonjs) {
		presetEnvOptions.modules = false;
	}

	if (typescript) {
		presets.push('@babel/preset-typescript');
	}

	if (react) {

		switch (process.env.NODE_ENV) {

			case 'production':
				presets.push('@babel/preset-react');
				plugins.push(
					'babel-plugin-react-local',
					['@babel/plugin-transform-react-constant-elements', reactConstantElements],
					['babel-plugin-transform-react-remove-prop-types', reactRemovePropTypes],
					'babel-plugin-transform-react-class-to-function'
				);
				break;

			case 'development':
				presets.push('@babel/preset-react');

				try {
					require.resolve('react-hot-loader/babel');
					plugins.push('react-hot-loader/babel');
				} catch (err) {
					/* Ignore */
				}

				break;

			default:
				presets.push('@babel/preset-react');
				break;
		}
	}

	if (transformDynamicImport) {
		plugins.push('babel-plugin-dynamic-import-node');
	}

	if (requireContextHook) {
		plugins.push('babel-plugin-require-context-hook');
	}

	return {
		presets,
		plugins
	};
};
