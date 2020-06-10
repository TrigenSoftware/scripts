import {
	getConfigFromEnv,
	getParamFromEnv
} from './helpers';

export default {
	transpile: getConfigFromEnv('REACT_APP_TRANSPILE', {
		dependencies: [],
		extensions: []
	}),
	bdsl: getConfigFromEnv('REACT_APP_BDSL', {
		withStylesheets: true
	}),
	preact: getParamFromEnv('REACT_APP_PREACT', false)
};
