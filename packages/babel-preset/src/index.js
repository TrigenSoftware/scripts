const {
	declare
} = require('@babel/helper-plugin-utils');
const getEnvOptions = require('./envs');
const preset = require('./preset');

module.exports = declare(
	(api, options) => preset(api, getEnvOptions(options.env), options)
);
