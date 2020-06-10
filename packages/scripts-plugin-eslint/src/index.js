import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg,
	addScripts
} from '@trigen/scripts/helpers';

const scripts = {
	'lint:js': {
		cmd: 'eslint',
		args: FILL_ME
	},
	'lint:scripts': ['lint:js'],
	'lint': ['lint:scripts'],
	'test': ['lint']
};

export default function getScripts(args, allScripts, {
	lint = 'src/**/*.{js,jsx}'
} = {}) {
	return update(allScripts, {
		'lint:js': {
			$set: update(scripts['lint:js'], {
				args: {
					$push: [
						'--cache',
						...getScriptArg(args, 0, lint),
						...args
					]
				}
			})
		},
		'lint:scripts': {
			$apply: _ => addScripts(_, scripts['lint:scripts'])
		},
		'lint': {
			$apply: _ => addScripts(_, scripts.lint)
		},
		'test': {
			$apply: _ => addScripts(_, scripts.test)
		}
	});
}
