/* eslint-disable import/no-dynamic-require */
import path from 'path';
import resolve from 'resolve-cwd';

export function getPlugins(plugins, prefix) {
	return plugins.map((_) => {

		let name = '';
		let params = {};
		let plugin = null;

		if (Array.isArray(_)) {
			name = _[0];
			params = _[1] || params;
		} else {
			name = _;
		}

		try {
			plugin = require(resolve(`${prefix}${name}`));
		} catch (err) {

			try {
				plugin = require(resolve(name));
			} catch (err2) {
				throw err2;
			}
		}

		return [plugin, params];
	});
}

export function getPluginsDependencies(plugins, prefix) {
	return plugins.map((_) => {

		let name = '';
		let pkg = null;

		if (Array.isArray(_)) {
			name = _[0];
		} else {
			name = _;
		}

		try {
			pkg = require(resolve(path.join(`${prefix}${name}`, 'package.json')));
		} catch (err) {

			try {
				pkg = require(resolve(path.join(name, 'package.json')));
			} catch (err2) {
				throw err2;
			}
		}

		return pkg.dependencies;
	});
}
