import {
	promises as fs
} from 'fs';
import path from 'path';
import {
	createHash
} from 'crypto';
import {
	ReactElement
} from 'react';
import {
	renderToString
} from 'react-dom/server';
import * as Html from './injectors';

export {
	Html
};

interface IOutput {
	path: string;
	content: string;
}

export default abstract class Renderer {

	protected BUILD_DIR = 'build';
	protected INDEX_HTML = 'index.html';
	protected template = '';
	protected readonly output: IOutput[] = [];

	protected write(path: string, content: string) {
		this.output.push({
			path,
			content
		});
	}

	protected async readTemplateFile() {

		const {
			BUILD_DIR,
			INDEX_HTML
		} = this;
		const template = await fs.readFile(path.join(BUILD_DIR, INDEX_HTML), 'utf8');

		return template;
	}

	protected async findPrecacheManifestFiles() {

		const {
			BUILD_DIR
		} = this;
		const files = await fs.readdir(BUILD_DIR);
		const precacheManifestFile = files.filter(_ => /precache-manifest/.test(_));

		if (!precacheManifestFile) {
			throw Error('No precache manifest');
		}

		return precacheManifestFile;
	}

	protected async writeAndInjectShellIntoPrecacheManifest(shellContent: string) {

		const {
			BUILD_DIR
		} = this;
		const hash = createHash('md5').update(shellContent).digest('hex');
		const precacheManifestFiles = await this.findPrecacheManifestFiles();

		for (const precacheManifestFile of precacheManifestFiles) {

			const precacheManifestPath = path.join(BUILD_DIR, precacheManifestFile);
			const precacheManifestContent = await fs.readFile(precacheManifestPath, 'utf8');
			const patchedPrecacheManifestContent = precacheManifestContent
				.replace(
					/,[\s\n]*\{[^{}]*"\/index.html"[^{}]*\}/,
					''
				)
				.replace(
					/\}[\s\n]*\]/,
					`}, { "revision": "${hash}", "url": "/shell.html" }]`
				);

			this.write(
				precacheManifestFile,
				patchedPrecacheManifestContent
			);
		}

		this.write(
			'shell.html',
			shellContent
		);
	}

	private async writeOutputs() {

		const {
			BUILD_DIR,
			output
		} = this;

		await Promise.all(
			output.map(async ({
				path: outputPath,
				content
			}) => {

				const dirname = path.dirname(outputPath);

				await fs.mkdir(
					path.join(BUILD_DIR, dirname),
					{ recursive: true }
				);

				await fs.writeFile(
					path.join(BUILD_DIR, outputPath),
					content
				);
			})
		);
	}

	protected abstract render(route: string): ReactElement|Promise<ReactElement>;

	// tslint:disable-next-line: variable-name
	protected renderTemplate(jsx: ReactElement, _route?: string): string {

		const {
			template
		} = this;
		const view = renderToString(jsx);

		return Html.apply(
			template,
			Html.setViewContent(view)
		);
	}

	protected async beforeRender() {
		this.template = await this.readTemplateFile();
	}

	protected async afterRender() {}

	async renderRoutes(routes: string[]) {

		const {
			INDEX_HTML
		} = this;

		await this.beforeRender();
		await Promise.all(
			routes.map(async (route) => {

				const jsx = await this.render(route);
				const html = this.renderTemplate(jsx, route);

				this.write(
					path.join(route, INDEX_HTML),
					html
				);
			})
		);
		await this.afterRender();
		await this.writeOutputs();
	}
}
