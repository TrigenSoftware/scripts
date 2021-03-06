import 'dotenv/config';
import {
	create
} from 'browser-sync';
import HttpProxyMiddleware from 'http-proxy-middleware';
import HistoryApiFallbackMiddleware from 'connect-history-api-fallback';
import {
	notify
} from './helpers';
import browserSyncConfigBase from './configs/browserSync';

const server = create();
const middleware = [
	process.env.PROXY_SERVER_URI && HttpProxyMiddleware(process.env.PROXY_SERVER_URI),
	!process.env.DISABLE_HISTORY_FALLBACK && HistoryApiFallbackMiddleware()
].filter(Boolean);
const browserSyncConfig = {
	...browserSyncConfigBase,
	middleware
};

server.init(browserSyncConfig, () => {
	notify('Server is working...');
});
