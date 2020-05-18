module.exports = {
	exclude: 'node_modules/**',
	ignore: [
		/\.babel\.jsx?$/,
	],
	presets: [
		['babel-preset-trigen', {
			env:      'lib',
			targets:  require('browserslist-config-trigen/node'),
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
				targets:  require('browserslist-config-trigen/browsers'),
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
