import configure from '@trigen/scripts-plugin-storybook/storybook/webpack.config';
import * as webpackConfig from '../webpack';

module.exports = configureStorybook;

function configureStorybook(input) {
	const storybookBaseConfig = configure(input);
	const webpackSbConfig = input.mode === 'PRODUCTION'
		? webpackConfig.build()
		: webpackConfig.dev();

	storybookBaseConfig.resolve.extensions.push(
		...webpackSbConfig.resolve.extensions
	);
	Object.assign(
		storybookBaseConfig.resolve.alias,
		webpackSbConfig.resolve.alias
	);

	storybookBaseConfig.module.rules = [
		...storybookBaseConfig.module.rules.filter((rule) => {
			const test = String(rule.test);

			switch (true) {
				case /svg/.test(test):
					return false;

				case /css/.test(test):
					rule.exclude = /\.st\.css$/;
					return true;

				default:
					return true;
			}
		}),
		...webpackSbConfig.module.rules
	];

	storybookBaseConfig.plugins.push(
		...webpackSbConfig.plugins.filter((plugin) => {
			switch (plugin.constructor.name) {
				case 'HashedModuleIdsPlugin':
				case 'HtmlWebpackPlugin':
				case 'ScriptExtHtmlWebpackPlugin':
				case 'HtmlWebpackExcludeAssetsPlugin':
				case 'HotModuleReplacementPlugin':
				case 'WorkboxWebpackPlugin':
				case 'CleanPlugin':
				case 'FilterChunkWebpackPlugin':
				case 'CopyPlugin':
				case 'BdslWebpackPlugin':
					return false;

				default:
					return true;
			}
		})
	);

	return storybookBaseConfig;
}
