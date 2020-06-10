import path from 'path';
import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg,
	addScripts
} from '@trigen/scripts/helpers';

const storybookConfigs = path.join(__dirname, 'storybook');
const scripts = {
	'start:storybook': {
		vars: {},
		cmd: 'start-storybook',
		args: FILL_ME
	},
	'build:storybook': {
		vars: {
			NODE_ENV: 'development'
		},
		cmd: 'build-storybook',
		args: FILL_ME
	},
	'eject': [{
		cmd: 'cp',
		args: [
			'-R',
			path.join(__dirname, 'jest'),
			'scripts/jest'
		]
	}, {
		cmd: 'cp',
		args: [
			'-R',
			path.join(__dirname, 'storybook'),
			'scripts/storybook'
		]
	}]
};

export default function getScripts(args, allScripts, {
	storybookConfigs: inputStorybookConfigs
} = {}) {

	const storybookConfigsArgs = getScriptArg(args, '-c', inputStorybookConfigs || storybookConfigs);
	const storybookAutoConfigure = Boolean(!inputStorybookConfigs && storybookConfigsArgs.length);

	return update(allScripts, {
		'start:storybook': {
			$set: update(scripts['start:storybook'], {
				vars: {
					STORYBOOK_AUTO_CONFIGURE: {
						$set: JSON.stringify(storybookAutoConfigure)
					}
				},
				args: {
					$push: [
						'--ci',
						'-p',
						'3001',
						...storybookConfigsArgs,
						...args
					]
				}
			})
		},
		'build:storybook': {
			$set: update(scripts['build:storybook'], {
				vars: {
					STORYBOOK_AUTO_CONFIGURE: {
						$set: JSON.stringify(storybookAutoConfigure)
					}
				},
				args: {
					$set: [
						...storybookConfigsArgs,
						...getScriptArg(args, '-o', 'storybook-build'),
						...args
					]
				}
			})
		},
		'eject': {
			$apply: _ => addScripts(_, scripts.eject)
		}
	});
}
