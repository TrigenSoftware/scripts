/* eslint-disable no-undef */
import path from 'path';
import envCi from 'env-ci';
import initStoryshots from '@storybook/addon-storyshots';
import {
	imageSnapshot
} from '@storybook/addon-storyshots-puppeteer';
import start from './start';

export function customizePage(page) {
	return page.setViewport({
		width:  1280,
		height: 720
	});
}

export function getMatchOptions({
	context: {
		kind,
		story
	}
}) {
	return {
		customSnapshotIdentifier: `${kind}__${story.replace(/ /g, '-')}`
	};
}

const {
	isCi
} = envCi();

export function afterScreenshot({
	context: {
		kind,
		story
	}
}) {

	console.log(isCi);
	console.log(`📷 ${kind} ${story}`);
	process.stdout.write(`📷 ${kind} ${story}\n`);
}

export async function closeWebsockets(page) {

	if (page._frameManager.networkManager()._userRequestInterceptionEnabled) {
		return;
	}

	await page.setRequestInterception(true);

	page.on('request', (interceptedRequest) => {

		const url = interceptedRequest.url();

		if (url.includes('socket.io') || url.includes('__webpack_hmr')) {
			interceptedRequest.abort();
			return;
		}

		interceptedRequest.continue();
	});
}

export default async function init(options = {}, srcDir, url) {

	process.env.PROJECT_SRC = srcDir || path.join(process.cwd(), 'src');

	const finalOptions = {
		getMatchOptions,
		customizePage,
		afterScreenshot,
		...options
	};
	const server = start();
	const test = imageSnapshot({
		storybookUrl: url || 'http://localhost:3001',
		...finalOptions,
		async customizePage(page) {
			await closeWebsockets(page);
			await finalOptions.customizePage(page);
		}
	});
	const {
		beforeAll,
		afterAll
	} = test;

	test.beforeAll = async () => {

		await server.wait();

		try {
			await beforeAll();
		} catch (err) {
			console.error(err);
		}
	};

	test.afterAll = async () => {
		server.kill();
		await afterAll();
	};

	initStoryshots({
		suite: 'Storyshots',
		test
	});
}
