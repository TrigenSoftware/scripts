import {
	StylableWebpackPlugin
} from '@stylable/webpack-plugin';

export class StylableImportOrderPlugin {
	constructor({
		fullControl = false
	} = {}) {
		this.fullControl = fullControl;
		this.importOrder = 0;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap(StylableWebpackPlugin.name, (compilation) => {
			compilation.hooks.optimizeModules.tap(StylableWebpackPlugin.name, (modules) => {
				modules.forEach((module) => {
					if (module.type === 'stylable') {
						if (this.fullControl) {
							module.buildInfo.runtimeInfo.depth = this.importOrder++;
						} else {
							module.buildInfo.runtimeInfo.depth += parseFloat(`0.${this.importOrder++}`);
						}
					}
				});
			});
		});
	}
}
