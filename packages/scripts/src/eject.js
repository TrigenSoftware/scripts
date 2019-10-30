import {
	promises as fs
} from 'fs';
import {
	getDependencies
} from './scripts';

export default async function eject(scripts) {

	try {
		await fs.mkdir('scripts');
	} catch (err) {
		/* Silent */
	}

	const tasks = Object.entries(scripts).map(async ([name, script]) => {

		if (name === 'eject') {
			return;
		}

		const filename = scriptToFilename(name);
		const body = scriptToString(script);
		const scriptFile = bashScript(body);

		await fs.writeFile(filename, scriptFile);
	});

	await Promise.all(tasks);
	await ejectPackages();
}

async function ejectPackages() {

	const pluginsDependencies = getDependencies();
	const pkg = JSON.parse(await fs.readFile('package.json'));
	const {
		scripts
	} = pkg;

	for (const scriptName in scripts) {

		const cmd = scripts[scriptName];

		if (cmd.startsWith('trigen-scripts')) {

			const [
				,
				script,
				...args
			] = cmd.split(' ');

			scripts[scriptName] = `${scriptToFilename(script)} ${args.join(' ')}`.trim();
		}
	}

	Object.assign(pkg.devDependencies, pluginsDependencies);

	await fs.writeFile('package.json', JSON.stringify(pkg, null, '  '));
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

function cmdToString({
	vars,
	cmd,
	args,
	ignoreResult
}) {
	return `${ignoreResult
		? 'set +e; '
		: ''
	}${vars
		? `${varsToString(vars)} `
		: ''
	}${cmd}${
		args.length
			? ' '
			: ''
	}${patchArgs(args).join(' ')} $@${ignoreResult
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
