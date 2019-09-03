import update from 'immutability-helper';
import WorkboxPlugin from '@flexis/workbox-webpack-plugin';
import {
	HotModuleReplacementFilterPlugin
} from 'hmr-filter-webpack-plugin';
import {
	excludeAssets
} from './common';

const serviceWorkerTest = /(\/|\.)serviceWorker\.(js|ts)$/;

export function base(config) {
	return update(config, {
		module: {
			rules: { $unshift: [{
				test:    serviceWorkerTest,
				exclude: /node_modules/,
				loader:  'service-worker-loader',
				options: {
					filename: '[name].js'
				}
			}] }
		},
		plugins: { $push: [
			new WorkboxPlugin(serviceWorkerTest, {
				exclude: excludeAssets
			})
		] }
	});
}

export function dev(config) {
	return update(config, {
		plugins: { $unshift: [
			new HotModuleReplacementFilterPlugin((compilation) => {

				const {
					name
				} = compilation.compiler;

				return name && name.includes('worker');
			})
		] }
	});
}

export function build(config) {
	return config;
}

export {
	build as render
};
