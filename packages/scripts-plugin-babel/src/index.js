import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg
} from '@trigen/scripts/helpers';

const scripts = {
	start: {
		vars: {
			NODE_ENV: 'development'
		},
		cmd: 'babel-node',
		args: FILL_ME
	},
	build: {
		vars: {
			NODE_ENV: 'production'
		},
		cmd: 'babel',
		args: FILL_ME
	}
};

export default function getScripts(args, allScripts) {
	return update(allScripts, {
		start: {
			$set: update(scripts.start, {
				args: {
					$push: [
						...getScriptArg(args, 0, 'src/index.js'),
						...args
					]
				}
			})
		},
		build: {
			$set: update(scripts.build, {
				args: {
					$push: [
						...getScriptArg(args, 0, './src'),
						...getScriptArg(args, '-d', './lib'),
						...getScriptArg(args, '-s', 'inline'),
						...args
					]
				}
			})
		}
	});
}
