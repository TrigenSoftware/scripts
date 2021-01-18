import path from 'path';
import webpack from 'webpack';
import externals from 'webpack-node-externals';
import FilterWarningPlugins from 'webpack-filter-warnings-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import ScriptHtmlPlugin from 'script-ext-html-webpack-plugin';
import {
	HtmlWebpackSkipAssetsPlugin as ExcludeHtmlPlugin
} from 'html-webpack-skip-assets-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import BdslPlugin, {
	getBrowserslistEnvList
} from 'bdsl-webpack-plugin';
import update from 'immutability-helper';
import {
	decamelize
} from 'humps';
import {
	findIndex,
	applyReducers,
	addDevScripts,
	getWebpackHook,
	createDependenciesRegExp,
	pasteBrowserslistEnv
} from '../helpers';
import getBabelConfig from '../configs/babel';
import htmlminConfig from '../configs/htmlmin';
import {
	CleanPlugin
} from './CleanPlugin';
import {
	excludeAssets
} from './common';
import * as stylableLoader from './stylableLoader';
import * as svgLoader from './svgLoader';
import * as swLoader from './swLoader';

const cwd = process.cwd();
const loaders = [
	stylableLoader,
	svgLoader,
	swLoader,
	getWebpackHook()
];
const baseLoaders = loaders.map(_ => _.base);
const devLoaders = loaders.map(_ => _.dev);
const buildLoaders = loaders.map(_ => _.build);
const renderLoaders = loaders.map(_ => _.render);
const ignoreWarnings = loaders.reduce((all, {
	ignoreWarnings
}) => {
	if (ignoreWarnings) {
		return all.concat(ignoreWarnings);
	}

	return all;
}, [
	/**
	 * Ignore warnings about TypeScript interfaces.
	 */
	/export 'I[A-Z][^']+'(| \([^)]+\)) was not found in/,
	/**
	 * Ignore warnings about favicons coping.
	 */
	/unable to locate 'src\/(favicons|manifest)/
]);
const javascriptTest = /\.jsx?$/;
const typescriptTest = /\.tsx?$/;
const preactAlias = {
	'react': 'preact/compat',
	'react-dom': 'preact/compat',
	'react-hot-loader': path.join(__dirname, './PreactHotLoader.js')
};

function base(params = {}) {
	const {
		isFirstBuild = true,
		envify = {},
		preact
	} = params;
	const alias = preact
		? preactAlias
		: {};

	return applyReducers(baseLoaders, params, {
		entry: {
			index: path.join(cwd, 'src/App/index.tsx')
		},
		output: {
			path: path.join(cwd, 'build'),
			filename: '[name].js',
			chunkFilename: '[name].js',
			hashDigestLength: 10,
			publicPath: '/'
		},
		resolve: {
			extensions: [
				'.es.js',
				'.js',
				'.jsx',
				'.ts',
				'.tsx',
				'.json'
			],
			alias: {
				'~': path.join(cwd, 'src/App'),
				...alias
			}
		},
		module: {
			rules: [{
				test: javascriptTest,
				parser: {
					amd: false
				}
			}, {
				test: javascriptTest,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true
				}
			}, {
				test: typescriptTest,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: {
						cacheDirectory: true
					}
				},
				{
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						compilerOptions: {
							sourceMap: true,
							inlineSourceMap: false,
							declaration: false,
							declarationMap: false
						}
					}
				},
				isFirstBuild && {
					loader: 'eslint-loader',
					options: {
						cache: true,
						emitError: true,
						emitWarning: true
					}
				}].filter(Boolean)
			}]
		},
		plugins: [
			new webpack.EnvironmentPlugin(Object.keys(process.env)),
			new webpack.DefinePlugin(
				Object.entries(envify).reduce((env, [key, value]) => ({
					...env,
					[`process.env.${decamelize(key).toUpperCase()}`]: JSON.stringify(value)
				}), {})
			),
			new FilterWarningPlugins({
				exclude: ignoreWarnings
			}),
			new CopyPlugin({
				patterns: [{
					from: 'src/favicons/**/*.{ico,png}',
					to: 'favicons',
					flatten: true
				}, {
					from: 'src/manifest.json'
				}]
			}),
			isFirstBuild && new ForkTsCheckerPlugin({
				async: false
			})
		].filter(Boolean)
	});
}

export function dev(params = {}) {
	const {
		preact
	} = params;
	const config = base(params);
	const devScripts = [
		'webpack-hot-middleware/client?http://localhost:3000/&reload=true',
		!preact && 'react-hot-loader/patch',
		preact && 'preact/debug'
	].filter(Boolean);

	return applyReducers(devLoaders, params, update(config, {
		entry: {
			$apply: entry => addDevScripts(entry, devScripts)
		},
		mode: {
			$set: 'development'
		},
		devtool: {
			$set: 'inline-source-map'
		},
		optimization: {
			$set: {
				noEmitOnErrors: true
			}
		},
		plugins: {
			$unshift: [
				new webpack.HotModuleReplacementPlugin(),
				new HtmlPlugin({
					template: 'src/index.html'
				})
			]
		}
	}));
}

export function build(params = {}) {
	const config = base(params);
	const {
		isFirstBuild = true,
		browserslistEnv,
		transpile = {},
		bdsl
	} = params;
	const filenameTemplate = pasteBrowserslistEnv('[name].[env].[chunkhash].js', browserslistEnv);
	const dependencies = [
		...transpile.dependencies || []
	];
	const extensions = [
		...transpile.extensions || [],
		'.babel.js'
	];
	const dependenciesRegExp = createDependenciesRegExp({
		dependencies,
		extensions
	});
	const excludeDependencies = _ => /node_modules/.test(_) && !dependenciesRegExp.test(_);
	const babelConfig = getBabelConfig(browserslistEnv);

	return applyReducers(buildLoaders, params, update(config, {
		name: {
			$set: browserslistEnv
		},
		output: {
			filename: {
				$set: filenameTemplate
			},
			chunkFilename: {
				$set: filenameTemplate
			}
		},
		resolve: {
			mainFields: {
				$set: [
					'raw',
					'browser',
					'module',
					'main'
				]
			},
			extensions: {
				$unshift: extensions
			}
		},
		mode: {
			$set: 'production'
		},
		module: {
			rules: {
				$apply: rules => update(rules, {
					[findIndex('loader', 'babel-loader', rules)]: {
						exclude: {
							$set: excludeDependencies
						},
						options: {
							$merge: babelConfig
						}
					},
					[findIndex('test', typescriptTest, rules)]: {
						exclude: {
							$set: excludeDependencies
						},
						use: {
							$apply: (use) => {
								const mutation = {
									[findIndex('loader', 'babel-loader', use)]: {
										options: {
											$merge: babelConfig
										}
									}
								};

								if (isFirstBuild) {
									mutation[findIndex('loader', 'eslint-loader', use)] = {
										options: {
											failOnError: {
												$set: true
											}
										}
									};
								}

								return update(use, mutation);
							}
						}
					}
				})
			}
		},
		optimization: {
			$set: {
				runtimeChunk: 'single',
				splitChunks: {
					name: true,
					cacheGroups: {
						default: {
							chunks: 'initial',
							minChunks: 2
						},
						vendor: {
							name: 'vendor',
							chunks: 'initial',
							priority: 10,
							enforce: true,
							test(module) {
								if (module.resource && !/\.(j|t)sx?$/.test(module.resource)) {
									return false;
								}

								return module.context
									&& module.context.includes('node_modules')
									&& !module.context.includes('@flexis/ui/components'); // sad hack
							}
						}
					}
				}
			}
		},
		plugins: {
			$unshift: [
				isFirstBuild && new CleanPlugin(),
				new webpack.HashedModuleIdsPlugin(),
				new HtmlPlugin({
					template: 'src/index.html',
					inject: 'head',
					minify: htmlminConfig,
					excludeAssets
				}),
				new ScriptHtmlPlugin({
					defaultAttribute: 'defer'
				}),
				new ExcludeHtmlPlugin(),
				bdsl && new BdslPlugin({
					...bdsl,
					env: browserslistEnv,
					isModule: config.moduleEnv === browserslistEnv
				})
			].filter(Boolean)
		}
	}));
}

export function render(params = {}) {
	const config = base(params);

	return applyReducers(renderLoaders, params, update(config, {
		entry: {
			$set: {
				index: path.join(cwd, 'src/App/render.tsx')
			}
		},
		output: {
			path: {
				$set: path.join(cwd, 'build', 'render')
			},
			libraryTarget: {
				$set: 'commonjs2'
			}
		},
		target: {
			$set: 'node'
		},
		externals: {
			$set: [externals({
				whitelist: [/^@flexis\/ui/]
			})]
		},
		mode: {
			$set: 'production'
		},
		optimization: {
			$set: {
				minimize: false
			}
		},
		module: {
			rules: {
				$apply: rules => update(rules, {
					[findIndex('test', typescriptTest, rules)]: {
						use: {
							$apply: use => update(use, {
								[findIndex('loader', 'eslint-loader', use)]: {
									options: {
										failOnError: {
											$set: true
										}
									}
								}
							})
						}
					}
				})
			}
		},
		plugins: {
			$unshift: [
				new CleanPlugin(),
				new webpack.HashedModuleIdsPlugin()
			]
		}
	}));
}

export function dslBuild(params) {
	const webpackBuildConfigs = [
		...getBrowserslistEnvList(),
		undefined
	].map((browserslistEnv, index) => build({
		...params,
		isFirstBuild: index === 0,
		browserslistEnv
	}));

	return webpackBuildConfigs;
}
