import {
	notify,
	notifyError
} from './notify';

export function reporter(error, stats) {

	if (error) {
		notifyError(error);
		console.error(error);
		process.exit(1);
	}

	process.stdout.write(`${stats.toString({
		chunks: false,
		modules: false,
		colors: true
	})}\n`);

	if (stats.hasErrors()) {

		const error = new Error('Compilation has failed.');

		notifyError(error);
		process.exit(1);

	} else {
		notify('Compilation was done.');
	}
}
