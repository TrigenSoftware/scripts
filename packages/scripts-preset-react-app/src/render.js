import 'dotenv/config';
import webpack from 'webpack';
import {
	reporter
} from './helpers';
import * as webpackConfig from './webpack';
import options from './options';

const webpackBuildCompiler = webpack(webpackConfig.dslBuild(options));
const webpackRenderCompiler = webpack(webpackConfig.render(options));

webpackBuildCompiler.run((errors, stats) => {
	reporter(errors, stats);
	webpackRenderCompiler.run(reporter);
});
