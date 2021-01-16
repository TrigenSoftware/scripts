/**
 * Jest override
 */
const makePatterns = require('./makePatterns');

const postfixes = ['stories'];
const extensions = [
	'js',
	'jsx',
	'ts',
	'tsx'
];

module.exports = {
	overrides: [
		{
			files: makePatterns(postfixes, extensions),
			rules: {
				'max-classes-per-file': 'off',
				'no-magic-numbers': 'off',
				'@typescript-eslint/no-magic-numbers': 'off',
				'max-nested-callbacks': 'off',
				'react/no-array-index-key': 'off',
				'react/jsx-no-bind': 'off'
			}
		}
	]
};
