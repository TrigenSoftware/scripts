import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg,
	addScripts
} from '@trigen/scripts/helpers';

const scripts = {
	'lint:scripts': {
		cmd: 'eslint',
		args: FILL_ME
	},
	'lint': ['lint:scripts'],
	'test': ['lint']
};

export default function getScripts(args, allScripts, {
	lint = 'src/**/*.{js,jsx,ts,tsx}'
} = {}) {
	return update(allScripts, {
		'lint:scripts': {
			$set: update(scripts['lint:scripts'], {
				args: {
					$push: [
						'--cache',
						...getScriptArg(args, 0, lint),
						...args
					]
				}
			})
		},
		'lint': {
			$apply: _ => addScripts(_, scripts.lint)
		},
		'test': {
			$apply: _ => addScripts(_, scripts.test)
		}
	});
}
