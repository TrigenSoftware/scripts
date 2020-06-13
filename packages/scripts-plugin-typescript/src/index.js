import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg,
	addScripts
} from '@trigen/scripts/helpers';

const scripts = {
	'typecheck': {
		cmd: 'tsc',
		args: ['--noEmit', '--pretty', '--skipLibCheck']
	},
	'test': ['typecheck'],
	'start': {
		vars: {
			NODE_ENV: 'development'
		},
		cmd: 'ts-node-dev',
		args: FILL_ME
	},
	'build:docs': [{
		cmd: 'typedoc',
		args: FILL_ME,
		ignoreResult: true
	}, {
		cmd: 'touch',
		args: ['docs/.nojekyll']
	}],
	'build': {
		vars: {
			NODE_ENV: 'production'
		},
		cmd: 'tsc',
		args: FILL_ME
	}
};

export default function getScripts(args, allScripts) {
	return update(allScripts, {
		'typecheck': {
			$set: update(scripts.typecheck, {
				args: {
					$push: args
				}
			})
		},
		'test': {
			$apply: _ => addScripts(_, scripts.test, null, true)
		},
		'start': {
			$set: update(scripts.start, {
				args: {
					$push: [
						'-P',
						'./tsconfig.dev.json',
						'-r',
						'tsconfig-paths/register',
						'--respawn',
						'--transpileOnly',
						'--ignore-watch',
						'node_modules',
						...getScriptArg(args, 0, 'src/index.ts'),
						...args
					]
				}
			})
		},
		'build:docs': {
			$set: update(scripts['build:docs'], {
				0: {
					args: {
						$push: [
							'./src',
							...getScriptArg(args, '--out', './docs'),
							'--ignoreCompilerErrors',
							'--excludeExternals',
							'--mode',
							'modules',
							...args
						]
					}
				}
			})
		},
		'build': {
			$set: update(scripts.build, {
				args: {
					$push: [
						'--rootDir',
						...getScriptArg(args, 0, './src'),
						...getScriptArg(args, '--outDir', './lib'),
						...args
					]
				}
			})
		}
	});
}
