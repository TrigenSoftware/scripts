import fs from 'fs';
import path from 'path';
import lib from '../../packages/scripts-preset-lib/src';

const cwd = process.cwd();
const packages = path.join(cwd, 'packages');
const configs = [
	'browserslist-config',
	'eslint-config',
	'stylelint-config',
	'babel-preset'
];
const plugins = fs.readdirSync(packages).filter(
	_ => _ !== 'scripts' && _[0] !== '.' && !configs.includes(_)
);

describe('@trigen/scripts-*', () => {

	plugins.forEach((_) => {

		it(`${_} should return correct scripts object`, () => {

			// eslint-disable-next-line import/no-dynamic-require
			const scripts = require(path.join(packages, _, 'src', 'index.js')).default([], {});

			let scriptsSnapshot = JSON.stringify(scripts, null, '\t');

			while (scriptsSnapshot.includes(cwd)) {
				scriptsSnapshot = scriptsSnapshot.replace(cwd, '');
			}

			expect(scriptsSnapshot).toMatchSnapshot();
		});
	});

	it('`scripts-preset-lib` should add cwd to publish subdir', () => {

		let scripts = lib([], {});

		expect(scripts.cleanPublish).toEqual([
			'test',
			{
				cmd: 'clean-publish',
				args: []
			}
		]);

		scripts = lib([], {}, {
			publish: 'packages'
		});

		expect(scripts.cleanPublish).toEqual([
			'test',
			{
				cwd: 'packages',
				cmd: 'clean-publish',
				args: []
			}
		]);
	});
});
