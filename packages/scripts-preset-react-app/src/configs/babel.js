/* eslint-disable import/no-dynamic-require */
import path from 'path';
import fs from 'fs';
import {
	getBrowserslistQueries
} from 'bdsl-webpack-plugin';

const configFiles = [
	'babel.config.js',
	'babel.config.json',
	'.babelrc',
	'.babelrc.js',
	'.babelrc.json'
];

export default function getBabelConfig(browserslistEnv) {

	const babelConfig = configFiles.reduce((babelConfig, filename) => {

		if (babelConfig) {
			return babelConfig;
		}

		const configPath = path.join(process.cwd(), filename);

		try {

			if (/\.js/.test(filename)) {
				return require(configPath);
			}

			return JSON.parse(
				fs.readFileSync(configPath, 'utf8')
			);
		} catch (err) {
			return babelConfig;
		}
	}, undefined) || {};

	if (browserslistEnv && Array.isArray(babelConfig.presets)) {

		const trigenPreset = babelConfig.presets.find(
			([preset]) => (
				preset === 'babel-preset-trigen'
				|| preset === '@trigen/babel-preset'
			)
		);

		if (trigenPreset) {
			trigenPreset[1].targets = getBrowserslistQueries({
				env: browserslistEnv
			});
		}
	}

	Reflect.deleteProperty(babelConfig, 'exclude');

	return babelConfig;
}
