/* eslint-disable no-undef */
import puppeteer from 'puppeteer';
import {
	toMatchImageSnapshot
} from 'jest-image-snapshot';
import {
	customizePage as defaultCustomizePage,
	closeWebsockets
} from '@trigen/scripts-plugin-storybook/jest/storyshots';
import start from '@trigen/scripts-plugin-storybook/jest/start';

expect.extend({
	toMatchImageSnapshot
});

// We consider taking the full page is a reasonnable default.
function defaultScreenshotOptions() {
	return {
		fullPage: true
	};
}

const noop = () => undefined;
const defaultConfig = {
	url: 'http://localhost:3000',
	chromeExecutablePath: undefined,
	getMatchOptions: noop,
	getScreenshotOptions: defaultScreenshotOptions,
	beforeScreenshot: noop,
	getGotoOptions: noop,
	customizePage: defaultCustomizePage,
	getCustomBrowser: undefined,
	launch: {}
};

export default function initRouteshots(routes, customConfig = {}) {
	const server = start('start');
	const {
		url,
		chromeExecutablePath,
		getMatchOptions,
		getScreenshotOptions,
		beforeScreenshot,
		getGotoOptions,
		customizePage,
		getCustomBrowser,
		...config
	} = {
		...defaultConfig,
		...customConfig
	};
	// add some options "no-sandbox" to make it work properly on some Linux systems as proposed here: https://github.com/Googlechrome/puppeteer/issues/290#issuecomment-322851507
	const launchConfig = {
		args: [
			'--no-sandbox ',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage'
		],
		executablePath: chromeExecutablePath,
		...config.launch
	};
	let browser = null; // holds ref to browser. (ie. Chrome)
	let page = null; // Hold ref to the page to screenshot.

	describe('Routeshots', () => {
		beforeAll(async () => {
			await server.wait();

			if (getCustomBrowser) {
				browser = await getCustomBrowser();
			} else {
				browser = await puppeteer.launch(launchConfig);
			}

			page = await browser.newPage();

			await closeWebsockets(page);
		});

		afterAll(() => {
			server.kill();

			if (getCustomBrowser && page) {
				return page.close();
			}

			return browser.close();
		});

		routes.forEach((route) => {
			it(route, async () => {
				if (!browser || !page) {
					throw new Error('no-headless-browser-running');
				}

				expect.assertions(1);

				await customizePage(page);
				await page.goto(`${url}${route}`, getGotoOptions(route));
				await beforeScreenshot(page, route);

				const image = await page.screenshot(getScreenshotOptions(route));

				expect(image).toMatchImageSnapshot({
					...getMatchOptions(route),
					customSnapshotIdentifier: `Route__${route.replace(/^[^\w]|[^\w]$/g, '').replace(/[^\w]/g, '-')}`
				});
			});
		});
	});
}
