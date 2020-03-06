import {
	spawn
} from 'child_process';

export default function start(script = 'start:storybook') {

	const server = spawn('yarn', [script], {
		cwd: process.cwd(),
		env: {
			...process.env,
			NODE_ENV: 'development'
		},
		detached: true
	});
	const wait = new Promise((resolve) => {
		server.stdout.on('data', (data) => {

			if (data.toString('utf8').includes('webpack built')) {
				resolve();
			}
		});
		server.stderr.on('data', () => {});
	});

	return {
		wait: () => wait,
		kill: () => process.kill(-server.pid)
	};
}
