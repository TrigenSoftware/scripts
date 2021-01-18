import path from 'path';
import envCi from 'env-ci';
import initStoryshots from '@storybook/addon-storyshots';
import {
	imageSnapshot
} from '@storybook/addon-storyshots-puppeteer';
import start from './start';

export function customizePage(page) {
	return page.setViewport({
		width: 1280,
		height: 720
	});
}

const {
	isCi
} = envCi();

export function getMatchOptions({
	context: {
		kind,
		story
	}
}) {
	if (isCi) {
		process.stdout.write(`📷  ${kind} ${story}\n`);
	}

	return {
		customSnapshotIdentifier: `${kind}__${story.replace(/ /g, '-')}`
	};
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

export default function init(options = {}, srcDir = false, url = false) {
	process.env.PROJECT_SRC = srcDir || path.join(process.cwd(), 'src');

	const finalOptions = {
		getMatchOptions,
		customizePage,
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
		await beforeAll();
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
