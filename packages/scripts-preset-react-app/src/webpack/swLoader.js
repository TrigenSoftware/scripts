import update from 'immutability-helper';
import WorkboxPlugin from '@flexis/workbox-webpack-plugin';
import {
	HotModuleReplacementFilterPlugin
} from 'hmr-filter-webpack-plugin';
import {
	findIndex,
	pasteBrowserslistEnv
} from '../helpers';
import {
	excludeAssets
} from './common';

const serviceWorkerTest = /(\/|\.)serviceWorker\.(js|ts)$/;

export function base(config) {
	return update(config, {
		module: {
			rules: {
				$unshift: [{
					test: serviceWorkerTest,
					exclude: /node_modules/,
					loader: 'service-worker-loader',
					options: {
						filename: '[name].js'
					}
				}]
			}
		},
		plugins: {
			$push: [
				new WorkboxPlugin(serviceWorkerTest, {
					exclude: excludeAssets
				})
			]
		}
	});
}

export function dev(config) {
	return update(config, {
		plugins: {
			$unshift: [
				new HotModuleReplacementFilterPlugin((compilation) => {

					const {
						name
					} = compilation.compiler;

					return name && name.includes('worker');
				})
			]
		}
	});
}

export function build(config, {
	browserslistEnv
}) {

	if (typeof browserslistEnv !== 'string') {
		return config;
	}

	return update(config, {
		module: {
			rules: {
				$apply: rules => update(rules, {
					[findIndex('loader', 'service-worker-loader', rules)]: {
						options: {
							filename: {
								$set: pasteBrowserslistEnv('[name].[env].js', browserslistEnv)
							}
						}
					}
				})
			}
		}
	});
}

export {
	build as render
};
