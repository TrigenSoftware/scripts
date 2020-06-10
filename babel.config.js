module.exports = {
	exclude: 'node_modules/**',
	ignore: [
		/\.babel\.jsx?$/
	],
	presets: [
		['babel-preset-trigen', {
			env:      'lib',
			targets:  require('./packages/browserslist-config/src/node'),
			commonjs: true
		}]
	],
	overrides: [{
		test:    [
			/(IconComponent|storybook\/config)\.jsx?$/,
			/helpers\/renderer/
		],
		presets: [
			['babel-preset-trigen', {
				env:      'lib',
				targets:  require('./packages/browserslist-config/src/browsers'),
				commonjs: true,
				react:    true
			}]
		]
	}],
	env: {
		test: {
			presets: [
				['babel-preset-trigen', {
					env: 'jest'
				}]
			]
		}
	}
};
