import path from 'path';
import update from 'immutability-helper';
import {
	FILL_ME,
	getScriptArg,
	addScripts
} from '@trigen/scripts/helpers';
import babel from '@trigen/scripts-plugin-babel';
import typescript from '@trigen/scripts-plugin-typescript';
import eslint from '@trigen/scripts-plugin-eslint';
import jest from '@trigen/scripts-plugin-jest';
import storybook from '@trigen/scripts-plugin-storybook';

const storybookConfigs = path.join(__dirname, 'storybook');
const scripts = {
	'lint:styles': {
		cmd: 'stylelint',
		args: FILL_ME
	},
	'lint': ['lint:styles'],
	'test': ['build'],
	'start': {
		vars: {
			NODE_ENV: 'development'
		},
		cmd: 'node',
		args: [path.join(__dirname, 'start.js')]
	},
	'build:favicons': {
		cmd: 'favicons',
		args: FILL_ME
	},
	'build': {
		vars: {
			NODE_ENV: 'production'
		},
		cmd: 'node',
		args: [path.join(__dirname, 'build.js')]
	},
	'build:render': {
		vars: {
			NODE_ENV: 'production',
			RENDERING: JSON.stringify(true)
		},
		cmd: 'node',
		args: [path.join(__dirname, 'render.js')]
	},
	'render': ['build:render', {
		cmd: 'node',
		args: ['build/render']
	}],
	'serve': {
		vars: {
			NODE_ENV: 'production'
		},
		cmd: 'node',
		args: [path.join(__dirname, 'serve.js')]
	}
};

export default function getScripts(args, inputAllScripts, {
	testSkipBuild = false,
	transpile = {},
	bdsl = {},
	preact = false
} = {}) {
	const storybookConfigsArgs = getScriptArg(args, '-c', storybookConfigs);
	const storybookAutoConfigure = Boolean(storybookConfigsArgs.length);
	let allScripts = inputAllScripts;

	allScripts = babel(args, allScripts);
	allScripts = typescript(args, allScripts);
	allScripts = eslint(args, allScripts);
	allScripts = storybook(args, allScripts, {
		storybookConfigs
	});
	allScripts = jest(args, allScripts);

	return update(allScripts, {
		'lint:styles': {
			$set: update(scripts['lint:styles'], {
				args: {
					$push: [
						...getScriptArg(args, 0, 'src/**/*.css'),
						...args
					]
				}
			})
		},
		'lint': {
			$apply: _ => addScripts(_, scripts.lint, null, true)
		},
		'test': {
			$apply: _ => (
				testSkipBuild
					? _
					: addScripts(_, scripts.test)
			)
		},
		'start:storybook': {
			vars: {
				REACT_APP_STORYBOOK_AUTO_CONFIGURE: {
					$set: JSON.stringify(storybookAutoConfigure)
				}
			}
		},
		'build:storybook': {
			vars: {
				REACT_APP_STORYBOOK_AUTO_CONFIGURE: {
					$set: JSON.stringify(storybookAutoConfigure)
				}
			}
		},
		'start': {
			$set: update(scripts.start, {
				vars: {
					REACT_APP_PREACT: {
						$set: JSON.stringify(preact)
					}
				},
				args: {
					$push: args
				}
			})
		},
		'build:favicons': {
			$set: update(scripts['build:favicons'], {
				args: {
					$push: [
						'-v',
						'-H',
						...getScriptArg(args, 0, 'src/favicon.svg'),
						...getScriptArg(args, '-p', 'favicons'),
						...getScriptArg(args, '-d', 'src/favicons'),
						...args
					]
				}
			})
		},
		'build': {
			$set: update(scripts.build, {
				vars: {
					REACT_APP_TRANSPILE: {
						$set: JSON.stringify(transpile)
					},
					REACT_APP_BDSL: {
						$set: JSON.stringify(bdsl)
					},
					REACT_APP_PREACT: {
						$set: JSON.stringify(preact)
					}
				},
				args: {
					$push: args
				}
			})
		},
		'build:render': {
			$set: update(scripts['build:render'], {
				vars: {
					REACT_APP_TRANSPILE: {
						$set: JSON.stringify(transpile)
					},
					REACT_APP_BDSL: {
						$set: JSON.stringify(bdsl)
					},
					REACT_APP_PREACT: {
						$set: JSON.stringify(preact)
					}
				},
				args: {
					$push: args
				}
			})
		},
		'render': {
			$set: update(scripts.render, {
				1: {
					args: {
						$push: args
					}
				}
			})
		},
		'serve': {
			$set: update(scripts.serve, {
				args: {
					$push: args
				}
			})
		}
	});
}
