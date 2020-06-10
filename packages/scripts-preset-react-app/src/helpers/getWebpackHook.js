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
		['@trigen/babel-preset', {
			env:      'lib',
			targets:  { node: 'current' },
			commonjs: true
		}]
	]
});

export function getWebpackHook() {

	try {
		return Object.assign({}, emptyHook, require(hookPath)); // eslint-disable-line
	} catch (err) {
		return emptyHook;
	}
}
