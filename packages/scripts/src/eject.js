import {
	promises as fs
} from 'fs';

export default async function eject(scripts) {

	try {
		await fs.mkdir('scripts');
	} catch (err) {
		/* Silent */
	}

	const tasks = Object.entries(scripts).map(async ([name, script]) => {

		const filename = scriptToFilename(name);
		const body = scriptToString(script);
		const scriptFile = bashScript(body);

		await fs.writeFile(filename, scriptFile);
	});

	await Promise.all(tasks);
}

function varsToString(vars) {
	return Object.entries(vars)
		.map(([key, value]) => `${key}=${value}`)
		.join(' ');
}

function patchArgs(args) {
	return args.map(arg => (
		arg.includes('node_modules/@trigen/scripts-')
			? arg.replace(/.*\/node_modules\/@trigen\/scripts[^/]+/, './scripts')
			: arg
	));
}

function cmdToString(cmd) {
	return `${cmd.ignoreResult
		? 'set +e; '
		: ''
	}${cmd.vars
		? `${varsToString(cmd.vars)} `
		: ''
	}${cmd.cmd} ${patchArgs(cmd.args).join(' ')} $@${cmd.ignoreResult
		? '; set -e'
		: ''
	}`;
}

function scriptToFilename(script) {
	return `./scripts/${script.replace(/:/, '-')}.sh`;
}

function scriptToRunScript(script) {
	return `${scriptToFilename(script)} $@`;
}

function scriptToString(script) {

	if (Array.isArray(script)) {
		return script.map(scriptToString).join('\n');
	}

	if (typeof script === 'string') {
		return scriptToRunScript(script);
	}

	return cmdToString(script);
}

function bashScript(body) {
	return `#!/bin/bash\n\nset -e\n\n${body}\n`;
}
