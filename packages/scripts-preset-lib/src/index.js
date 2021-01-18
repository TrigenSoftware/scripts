import update from 'immutability-helper';
import {
	FILL_ME,
	addScripts
} from '@trigen/scripts/helpers';
import eslint from '@trigen/scripts-plugin-eslint';

const scripts = {
	test: ['build'],
	cleanPublish: [
		'test',
		{
			cmd: 'clean-publish',
			args: FILL_ME
		}
	]
};

export default function getScripts(args, inputAllScripts, {
	publish = false,
	testSkipBuild = false
} = {}) {
	let allScripts = inputAllScripts;

	allScripts = eslint(args, allScripts);

	return update(allScripts, {
		test: {
			$apply: _ => (
				testSkipBuild
					? _
					: addScripts(_, scripts.test, allScripts)
			)
		},
		cleanPublish: {
			$set: update(scripts.cleanPublish, {
				1: {
					args: {
						$push: args
					},
					$apply: _ => (
						!publish ? _ : update(_, {
							cwd: {
								$set: publish
							}
						})
					)
				}
			})
		}
	});
}
