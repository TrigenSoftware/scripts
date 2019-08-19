import path from 'path';
import babelRegister from '@babel/register';

const scriptsPath = path.join(process.cwd(), 'scripts');
const hookPath = path.join(scriptsPath, 'webpack.js');
const emptyHook = {
	base:   _ => _,
	dev:    _ => _,
	build:  _ => _,
	render: _ => _
};

babelRegister({
	babelrc: false,
	only:    [
		file => !file.indexOf(scriptsPath)
	],
	presets: [
		['babel-preset-trigen', {
			targets:  { node: 'current' },
			commonjs: true
		}]
	]
});

export default function getWebpackHook() {

	try {
		return require(hookPath); // eslint-disable-line
	} catch (err) {
		return emptyHook;
	}
}
