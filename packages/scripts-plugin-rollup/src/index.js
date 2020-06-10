import path from 'path';
import update from 'immutability-helper';
import {
	addScripts
} from '@trigen/scripts/helpers';

const scripts = {
	build: {
		vars: {
			NODE_ENV: 'production'
		},
		cmd: 'rollup',
		args: ['-c']
	},
	eject: {
		cmd: 'cp',
		args: [
			path.join(__dirname, 'helpers.js'),
			'scripts/rollup-helpers.js'
		]
	}
};

export default function getScripts(args, allScripts) {
	return update(allScripts, {
		build: {
			$set: update(scripts.build, {
				args: {
					$push: args
				}
			})
		},
		eject: {
			$apply: _ => addScripts(_, scripts.eject)
		}
	});
}
