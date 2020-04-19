import path from 'path';
import update from 'immutability-helper';
import {
	findIndex
} from '../helpers';

const svgTest = /\.svg$/;
const runtimeGenerator = path.join(__dirname, '..', 'helpers', 'icons', 'svgToComponent.js');
const iconModule = path.join(__dirname, '..', 'helpers', 'icons', 'IconComponent.js');

export function base(config) {
	return update(config, {
		module: {
			rules: {
				$push: [{
					test: svgTest,
					use:  [{
						loader:  'svg-sprite-loader',
						options: {
							runtimeGenerator,
							runtimeOptions: {
								iconModule
							}
						}
					}]
				}]
			}
		}
	});
}

export function dev(config) {
	return config;
}

export function build(config, params) {
	return update(config, {
		module:  {
			rules: {
				$apply: rules => update(rules, {
					[findIndex('test', svgTest, rules)]: {
						use: {
							$apply: use => update(use, {
								[findIndex('loader', 'svg-sprite-loader', use)]: {
									options: {
										runtimeOptions: {
											iconModule: {
												$set: Reflect.has(params, 'browserslistEnv')
													? iconModule.replace('.js', '.babel.js')
													: iconModule
											}
										}
									}
								}
							}),
							$push: ['svgo-loader']
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
