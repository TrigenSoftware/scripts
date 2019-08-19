import 'dotenv/config';
import webpack from 'webpack';
import reporter from './helpers/reporter';
import * as webpackConfig from './webpack';

const webpackRenderCompiler = webpack(webpackConfig.render());

webpackRenderCompiler.run(reporter);
