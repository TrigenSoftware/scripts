import update from 'immutability-helper';
import {
	addScripts,
	saveScripts
} from '@trigen/scripts/helpers';
import babel from '@trigen/scripts-plugin-babel';
import eslint from '@trigen/scripts-plugin-eslint';
import jest from '@trigen/scripts-plugin-jest';
import rollup from '@trigen/scripts-plugin-rollup';

const scripts = {
	test: ['build']
};

export default function getScripts(args, inputAllScripts, {
	testSkipBuild = false
} = {}) {

	let allScripts = inputAllScripts;

	allScripts = saveScripts(['start'], babel(args, allScripts), allScripts);
	allScripts = eslint(args, allScripts);
	allScripts = jest(args, allScripts);
	allScripts = rollup(args, allScripts);

	return update(allScripts, {
		test: {
			$apply: _ => (
				testSkipBuild
					? _
					: addScripts(_, scripts.test)
			)
		}
	});
}
