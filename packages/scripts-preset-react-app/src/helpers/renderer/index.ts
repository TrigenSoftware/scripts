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
	protected buildDir = 'build';
	protected indexHtml = 'index.html';
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
			buildDir,
			indexHtml
		} = this;
		const template = await fs.readFile(path.join(buildDir, indexHtml), 'utf8');

		return template;
	}

	protected async findPrecacheManifestFiles() {
		const {
			buildDir
		} = this;
		const files = await fs.readdir(buildDir);
		const precacheManifestFile = files.filter(_ => /precache-manifest/.test(_));

		if (!precacheManifestFile) {
			throw Error('No precache manifest');
		}

		return precacheManifestFile;
	}

	protected async writeAndInjectShellIntoPrecacheManifest(shellContent: string) {
		const {
			buildDir
		} = this;
		const hash = createHash('md5').update(shellContent).digest('hex');
		const precacheManifestFiles = await this.findPrecacheManifestFiles();

		for (const precacheManifestFile of precacheManifestFiles) {
			const precacheManifestPath = path.join(buildDir, precacheManifestFile);
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
			buildDir,
			output
		} = this;

		await Promise.all(
			output.map(async ({
				path: outputPath,
				content
			}) => {
				const dirname = path.dirname(outputPath);

				await fs.mkdir(
					path.join(buildDir, dirname),
					{
						recursive: true
					}
				);

				await fs.writeFile(
					path.join(buildDir, outputPath),
					content
				);
			})
		);
	}

	protected abstract render(route: string): ReactElement|Promise<ReactElement>;

	protected renderTemplate(jsx: ReactElement, _route?: string): string {
		const {
			template
		} = this;
		const view = renderToString(jsx);

		// eslint-disable-next-line prefer-reflect
		return Html.apply(
			template,
			Html.setViewContent(view)
		);
	}

	protected async beforeRender() {
		this.template = await this.readTemplateFile();
	}

	protected async afterRender() {
		/* Method placeholder */
	}

	async renderRoutes(routes: string[]) {
		const {
			indexHtml
		} = this;

		await this.beforeRender();
		await Promise.all(
			routes.map(async (route) => {
				const jsx = await this.render(route);
				const html = this.renderTemplate(jsx, route);

				this.write(
					path.join(route, indexHtml),
					html
				);
			})
		);
		await this.afterRender();
		await this.writeOutputs();
	}
}
