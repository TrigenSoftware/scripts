import 'dotenv/config';
import webpack from 'webpack';
import {
	reporter
} from './helpers';
import * as webpackConfig from './webpack';
import options from './options';

const webpackBuildCompiler = webpack(webpackConfig.dslBuild(options));

webpackBuildCompiler.run(reporter);
