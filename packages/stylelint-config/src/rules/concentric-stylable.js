/**
 * Concentric Stylable
 */

const concentricCss = require('./concentric-css').slice();

module.exports = [
	// Stylable instructions
	[
		'extends',
		'states',
		'compose',
		'mixin',
		'from',
		'default',
		'theme',
		'named',
		'global'
	]
].concat(concentricCss);
