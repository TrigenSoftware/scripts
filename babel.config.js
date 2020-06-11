const babelPreset = './packages/babel-preset/src';

module.exports = {
	exclude: 'node_modules/**',
	ignore: [
		/\.babel\.jsx?$/
	],
	presets: [
		[babelPreset, {
			env: 'lib',
			targets: require('./packages/browserslist-config/src/node'),
			commonjs: true
		}]
	],
	overrides: [{
		test: [
			/(IconComponent|storybook\/config)\.jsx?$/,
			/helpers\/renderer/
		],
		presets: [
			[babelPreset, {
				env: 'lib',
				targets: require('./packages/browserslist-config/src/browsers'),
				commonjs: true,
				react: true
			}]
		]
	}],
	env: {
		test: {
			presets: [
				[babelPreset, {
					env: 'jest'
				}]
			]
		}
	}
};
