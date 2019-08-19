import update from 'immutability-helper';
import WorkboxPlugin from '@flexis/workbox-webpack-plugin';

const swTest = /(\/|\.)sw\.(js|ts)$/;

export function base(config) {
	return update(config, {
		module: {
			rules: { $push: [{
				test:    swTest,
				exclude: /node_modules/,
				loader:  'service-worker-loader',
				options: {
					filename: '[name].[chunkhash].js'
				}
			}] }
		},
		plugins: { $push: [
			new WorkboxPlugin(swTest)
		] }
	});
}

export function dev(config) {
	return config;
}

export function build(config) {
	return config;
}

export {
	build as render
};
