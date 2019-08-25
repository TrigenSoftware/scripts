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
		cmd:  'start-storybook',
		args: FILL_ME
	},
	'build:storybook': {
		vars: { NODE_ENV: 'development' },
		cmd:  'build-storybook',
		args: FILL_ME
	},
	'test': ['build:storybook']
};

export default function getScripts(args, allScripts, {
	storybookConfigs: inputStorybookConfigs,
	testSkipBuild = false
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
						'--ci', '-p', '3001',
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
		'test':            {
			$apply: _ => (
				testSkipBuild
					? _
					: addScripts(_, scripts.test)
			)
		}
	});
}
