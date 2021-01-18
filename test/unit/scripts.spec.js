import fs from 'fs';
import path from 'path';
import {
	getScripts
} from '../../packages/scripts/src/scripts';

const rcPath = path.join(__dirname, '.trigenscriptsrc');
const cwd = process.cwd();

function writeRC(scripts) {
	fs.writeFileSync(
		rcPath,
		JSON.stringify(
			scripts.map(_ => path.join(cwd, 'packages', `scripts-${_}`, 'src', 'index.js'))
		)
	);
}

function deleteRC() {
	fs.unlinkSync(rcPath);
}

describe('@trigen/scripts', () => {
	afterAll(deleteRC);

	describe('getScripts', () => {
		it('should get scripts by rc file', () => {
			writeRC([
				'plugin-eslint'
			]);

			const result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result).toEqual({
				'lint:scripts': {
					cmd: 'eslint',
					args: ['--cache', 'src/**/*.{js,jsx,ts,tsx}']
				},
				'lint': ['lint:scripts'],
				'test': ['lint']
			});
		});

		it('should pass args', () => {
			let result = getScripts(
				['packages/*/src/**/*.js'],
				{
					cwd: __dirname
				}
			);

			expect(result).toEqual({
				'lint:scripts': {
					cmd: 'eslint',
					args: ['--cache', 'packages/*/src/**/*.js']
				},
				'lint': ['lint:scripts'],
				'test': ['lint']
			});

			result = getScripts(
				['-v'],
				{
					cwd: __dirname
				}
			);

			expect(result).toEqual({
				'lint:scripts': {
					cmd: 'eslint',
					args: ['--cache', 'src/**/*.{js,jsx,ts,tsx}', '-v']
				},
				'lint': ['lint:scripts'],
				'test': ['lint']
			});
		});

		it('should combine plugins', () => {
			writeRC([
				'plugin-eslint',
				'plugin-typescript'
			]);

			const result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result.lint).toEqual(
				['lint:scripts']
			);

			expect(result.test).toEqual(
				['typecheck', 'lint']
			);
		});

		it('should combine plugins and preset', () => {
			writeRC([
				'plugin-typescript',
				'plugin-rollup',
				'preset-lib',
				'plugin-jest',
				'plugin-size-limit'
			]);

			const result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result.test).toEqual(
				['typecheck', 'lint', 'build', 'jest', 'checkSize']
			);
		});

		it('should save scripts from plugin', () => {
			writeRC([
				'preset-node-app'
			]);

			let result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result.start.cmd).toBe('babel-node');
			expect(result.build.cmd).toBe('rollup');

			writeRC([
				'plugin-typescript',
				'preset-node-app'
			]);

			result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result.start.cmd).toBe('ts-node-dev');
			expect(result.build.cmd).toBe('rollup');
		});

		it('should check scripts', () => {
			writeRC([
				'preset-lib'
			]);

			let result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result.test.includes('build')).toBe(false);

			writeRC([
				'plugin-typescript',
				'preset-lib'
			]);

			result = getScripts(
				[],
				{
					cwd: __dirname
				}
			);

			expect(result.test.includes('build')).toBe(true);
		});
	});
});
