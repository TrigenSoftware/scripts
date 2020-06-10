/**
 * JSDoc config
 */

module.exports = {
	plugins: [
		'jsdoc'
	],
	rules: {
		'jsdoc/check-property-names': ['warn', {
			enableFixer: true
		}],
		'jsdoc/require-hyphen-before-param-description': ['warn', 'always'],
		'jsdoc/require-jsdoc': 'off'
	},
	overrides: [{
		files: ['*.ts', '*.tsx'],
		rules: {
			'jsdoc/no-types': 'warn'
		}
	}]
};
