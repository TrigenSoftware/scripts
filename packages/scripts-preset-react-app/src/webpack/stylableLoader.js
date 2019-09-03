import StylablePlugin from '@stylable/webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import FilterPlugin from 'filter-chunk-webpack-plugin';
import postcss from 'postcss';
import update from 'immutability-helper';
import findIndex from '../helpers/findIndex';
import postcssConfig from '../configs/postcss';
import {
	filterAssets
} from './common';

const stylesProcessor = postcss(postcssConfig);

function postProcessor(stylableResult) {
	stylesProcessor.process(stylableResult.meta.outputAst).sync();
	return stylableResult;
}

export const ignoreWarnings = [
	/**
	 * Ignore warnings about elements in portals.
	 */
	/Stylable.*unscoped class "[a-zA-Z][^"]+" will affect all elements of the same type in the document/,
	/**
	 * Ignore warnings about .root class.
	 */
	/Stylable.*"\.root" class cannot be used after native elements or selectors external to the stylesheet/
];

export function base(config) {
	return update(config, {
		module: {
			rules: { $push: [{
				test:    /\.(eot|woff|ttf)$/,
				loader:  'file-loader',
				options: {
					name: '[path][name].[ext]'
				}
			}, {
				test:    /\.(jpg|webp|png|gif)$/,
				loader:  '@flexis/srcset-loader',
				options: {
					rules:            [{}],
					name:             '[path][name].[ext]',
					skipOptimization: true
				}
			}] }
		}
	});
}

export function dev(config) {
	return update(config, {
		plugins: { $push: [
			new StylelintPlugin({
				files: 'src/**/*.st.css'
			}),
			new StylablePlugin({
				transformHooks: { postProcessor }
			})
		] }
	});
}

export function build(config) {
	return update(config, {
		module: {
			rules: {
				[findIndex('loader', 'file-loader', config.module.rules)]: {
					options: {
						name: { $set: '[name].[hash:10].[ext]' }
					}
				},
				[findIndex('loader', '@flexis/srcset-loader', config.module.rules)]: {
					options: {
						name:             { $set: '[name].[hash:10].[ext]' },
						skipOptimization: { $set: false }
					}
				}
			}
		},
		plugins: {
			$unshift: [
				new FilterPlugin({
					patterns: filterAssets
				})
			],
			$push: [
				new StylelintPlugin({
					files:       'src/**/*.st.css',
					failOnError: true
				}),
				new StylablePlugin({
					filename:       '[name].[chunkhash].css',
					transformHooks: { postProcessor },
					optimize:       {
						removeUnusedComponents:   true,
						removeComments:           true,
						removeStylableDirectives: true,
						classNameOptimizations:   true, // big troubles with ssr, check it after
						shortNamespaces:          false,
						minify:                   true
					}
				})
			]
		}
	});
}

export function render(config) {
	return update(config, {
		module: {
			rules: {
				[findIndex('loader', 'file-loader', config.module.rules)]: {
					options: {
						name:     { $set: '[name].[hash:10].[ext]' },
						emitFile: { $set: false }
					}
				},
				[findIndex('loader', '@flexis/srcset-loader', config.module.rules)]: {
					options: {
						name:             { $set: '[name].[hash:10].[ext]' },
						skipOptimization: { $set: false },
						emitFile:         { $set: false }
					}
				}
			}
		},
		plugins: { $push: [
			new StylablePlugin({
				outputCSS:          false,
				includeCSSInJS:     false,
				optimize:           {
					classNameOptimizations: true, // big troubles with ssr, check it after
					shortNamespaces:        false
				}
			})
		] }
	});
}
