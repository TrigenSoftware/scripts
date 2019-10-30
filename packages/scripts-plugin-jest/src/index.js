import path from 'path';
import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg,
	addScripts
} from '@trigen/scripts/helpers';

const scripts = {
	'jest': {
		vars: { NODE_ENV: 'test' },
		cmd:  'jest',
		args: FILL_ME
	},
	'artifacts': {
		cmd:  'node',
		args: [path.join(__dirname, 'artifacts.js')]
	},
	'test':  ['jest'],
	'eject': {
		cmd:  'cp',
		args: [
			path.join(__dirname, 'artifacts.js'),
			'scripts/artifacts.js'
		]
	}
};

export default function getScripts(args, allScripts) {
	return update(allScripts, {
		'jest': {
			$set: update(scripts.jest, {
				args: {
					$push: [
						...getScriptArg(args, '-c', 'jest.config.json'),
						...args
					]
				}
			})
		},
		'artifacts': {
			$set: update(scripts.artifacts, {
				args: {
					$push: args
				}
			})
		},
		'test': {
			$apply: _ => addScripts(_, scripts.test)
		},
		'eject': {
			$apply: _ => addScripts(_, scripts.eject)
		}
	});
}
