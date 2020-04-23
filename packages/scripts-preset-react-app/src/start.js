import 'dotenv/config';
import webpack from 'webpack';
import {
	create
} from 'browser-sync';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import HttpProxyMiddleware from 'http-proxy-middleware';
import HistoryApiFallbackMiddleware from 'connect-history-api-fallback';
import {
	notify
} from './helpers';
import browserSyncConfigBase from './configs/browserSync';
import * as webpackConfig from './webpack';
import options from './options';

const server = create();
const webpackDevCompiler = webpack(webpackConfig.dev(options));

webpackDevCompiler.hooks.done.tap('trigen-scripts', () => {
	notify('Recompilation was done.');
});

const middleware = [
	WebpackDevMiddleware(webpackDevCompiler, {
		publicPath:  webpackDevCompiler.options.output.publicPath,
		writeToDisk: true,
		stats:       {
			chunks:  false,
			modules: false,
			colors:  true
		}
	}),
	WebpackHotMiddleware(webpackDevCompiler, {
		reload: true
	}),
	process.env.PROXY_API_URI && HttpProxyMiddleware(process.env.PROXY_API_URI),
	HistoryApiFallbackMiddleware()
].filter(Boolean);
const browserSyncWebpackOptions = {
	...browserSyncConfigBase,
	middleware
};

server.init(browserSyncWebpackOptions, () => {
	notify('Webpack dev server is working...');
});
