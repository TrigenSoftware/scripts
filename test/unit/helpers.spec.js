import {
	getScriptArg,
	addScripts,
	saveScripts
} from '../../packages/scripts/src/helpers';
import {
	external
} from '../../packages/scripts-plugin-rollup/src/helpers';

describe('@trigen/scripts', () => {

	describe('helpers', () => {

		describe('getScriptArg', () => {

			it('should return param', () => {

				expect(
					getScriptArg([], 0, 'test')
				).toEqual(
					['test']
				);

				expect(
					getScriptArg(['some', '--flag'], 1, 'test')
				).toEqual(
					['test']
				);
			});

			it('shouldn\'t return param', () => {

				expect(
					getScriptArg(['param'], 0, 'test')
				).toEqual(
					[]
				);

				expect(
					getScriptArg(['some', 'param'], 1, 'test')
				).toEqual(
					[]
				);
			});

			it('should return flag', () => {

				expect(
					getScriptArg([], '--flag', 'test')
				).toEqual(
					['--flag', 'test']
				);

				expect(
					getScriptArg(['some', 'flag'], '--flag')
				).toEqual(
					['--flag']
				);
			});

			it('shouldn\'t return flag', () => {

				expect(
					getScriptArg(['--flag'], '--flag', 'test')
				).toEqual(
					[]
				);
			});
		});

		describe('addScripts', () => {

			it('should add to `undefined`', () => {

				expect(
					addScripts(undefined, 'script')
				).toEqual(
					['script']
				);

				expect(
					addScripts(undefined, ['script'])
				).toEqual(
					['script']
				);

				expect(
					addScripts(undefined, ['script', 'script2'])
				).toEqual(
					['script', 'script2']
				);
			});

			it('should add to item', () => {

				expect(
					addScripts('item', 'script')
				).toEqual(
					['item', 'script']
				);

				expect(
					addScripts('item', ['script'])
				).toEqual(
					['item', 'script']
				);

				expect(
					addScripts('item', ['script', 'script2'])
				).toEqual(
					['item', 'script', 'script2']
				);
			});

			it('should add to items', () => {

				expect(
					addScripts(['item'], 'script')
				).toEqual(
					['item', 'script']
				);

				expect(
					addScripts(['item'], ['script'])
				).toEqual(
					['item', 'script']
				);

				expect(
					addScripts(['item'], ['script', 'script2'])
				).toEqual(
					['item', 'script', 'script2']
				);
			});

			it('should not add existing item', () => {

				expect(
					addScripts(['item'], 'item')
				).toEqual(
					['item']
				);
			});

			it('should filter scripts', () => {

				expect(
					addScripts(null, 'script', {})
				).toEqual(
					[]
				);

				expect(
					addScripts('item', 'script', {})
				).toEqual(
					['item']
				);

				expect(
					addScripts('item', 'script', {
						script: true
					})
				).toEqual(
					['item', 'script']
				);
			});

			it('should unshift', () => {

				expect(
					addScripts('item', 'script', null, true)
				).toEqual(
					['script', 'item']
				);

				expect(
					addScripts(['item'], ['script'], null, true)
				).toEqual(
					['script', 'item']
				);

				expect(
					addScripts(['item'], ['script', 'script2'], null, true)
				).toEqual(
					['script', 'script2', 'item']
				);
			});
		});

		describe('saveScripts', () => {

			it('should save scripts', () => {

				const scripts = saveScripts(['start', 'build'], {
					start: 'nextStart',
					build: 'nextBuild'
				}, {
					start: 'start'
				});

				expect(scripts).toEqual({
					start: 'start',
					build: 'nextBuild'
				});
			});
		});
	});
});

describe('@trigen/scripts-plugin-rollup', () => {

	describe('helpers', () => {

		describe('external', () => {

			it('should use dependencies', () => {

				const fn = external({
					dependencies: {
						react: 1
					}
				});

				expect(
					fn('react')
				).toBe(true);

				expect(
					fn('react/some')
				).toBe(true);

				expect(
					fn('preact/some')
				).toBe(false);
			});

			it('should use peerDependencies', () => {

				const fn = external({
					dependencies: {
						react: 1
					},
					peerDependencies: {
						webpack: 2
					}
				});

				expect(
					fn('react')
				).toBe(true);

				expect(
					fn('webpack/some')
				).toBe(true);

				expect(
					fn('preact/some')
				).toBe(false);
			});

			it('should exclude internals', () => {

				const fn = external({
					dependencies: {
						react: 1
					},
					peerDependencies: {
						webpack: 2
					}
				}, true);

				expect(
					fn('react')
				).toBe(true);

				expect(
					fn('webpack/some')
				).toBe(true);

				expect(
					fn('os')
				).toBe(true);

				expect(
					fn('fs')
				).toBe(true);

				expect(
					fn('preact/some')
				).toBe(false);
			});
		});
	});
});
