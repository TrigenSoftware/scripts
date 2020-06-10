
export default {
	server: 'build',
	ui: !process.env.DISABLE_BROWSER_SYNC && {
		port: 3001
	},
	ghostMode: !process.env.DISABLE_BROWSER_SYNC,
	open: false,
	notify: false,
	logSnippet: false,
	snippetOptions: {
		blacklist: process.env.DISABLE_BROWSER_SYNC && ['/', '**/*']
	}
};
