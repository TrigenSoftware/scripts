module.exports = {
	env: 'jest',
	targets: {
		node: 'current'
	},
	commonjs: true,
	transformDynamicImport: true,
	transformRuntime: false,
	requireContextHook: true
};
