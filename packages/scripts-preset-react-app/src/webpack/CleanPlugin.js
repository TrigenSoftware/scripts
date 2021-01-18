import path from 'path';
import del from 'del';

export class CleanPlugin {
	apply(compiler) {
		const {
			path: outputPath
		} = compiler.options.output;
		const cleanPattern = path.join(outputPath, '**', '*');

		compiler.hooks.beforeRun.tapPromise(
			CleanPlugin.name,
			() => del(cleanPattern)
		);
	}
}
