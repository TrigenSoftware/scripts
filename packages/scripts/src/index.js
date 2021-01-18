#!/usr/bin/env node
import chalk from 'chalk';
import spawn from './helpers/spawn';
import {
	getScriptAndArgs,
	getScripts
} from './scripts';
import eject from './eject';

const [
	exec,
	args
] = getScriptAndArgs(process.argv);
const scripts = getScripts(args);

function humanize(script) {
	return script
		.replace(/:/g, ' ')
		.replace(/([A-Z])/, ' $1')
		.toLowerCase()
		.replace(script[0].toLowerCase(), script[0].toUpperCase());
}

function run(script, ignoreTitle) {
	const command = scripts[script] || script;

	if (!ignoreTitle
		&& typeof script === 'string'
		&& script !== exec
	) {
		console.log(
			chalk.blue(`\n> ${
				humanize(script)
			}\n`)
		);
	}

	if (Array.isArray(command)) {
		const onlyOneCommand = command.length <= 1;

		command.forEach(_ => run(_, onlyOneCommand));
		return;
	}

	if (typeof command === 'string') {
		run(scripts[script]);
		return;
	}

	if (!command) {
		if (typeof script === 'string') {
			throw new Error(`Unknown script "${script}"`);
		}

		throw new Error('Unknown script');
	}

	const status = spawn(command);

	if (status) {
		process.exit(status);
	}
}

if (exec === 'eject') {
	try {
		run(exec);
	} catch (err) {
		/* Silent */
	}

	eject(scripts);
} else
if (scripts[exec]) {
	run(exec);
} else {
	throw new Error(`Unknown script "${exec}"`);
}
