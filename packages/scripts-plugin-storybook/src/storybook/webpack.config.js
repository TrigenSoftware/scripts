import path from 'path';
import fs from 'fs';

module.exports = configureStorybook;

function configureStorybook({
	config: storybookBaseConfig
}) {
	const projectRoot = process.cwd();
	const pkg = JSON.parse(
		fs.readFileSync(
			path.join(projectRoot, 'package.json'),
			'utf8'
		)
	);

	process.env.PROJECT_NAME = pkg.name;
	process.env.PROJECT_HOMEPAGE = pkg.repository.url.replace(/(^git\+)|(\.git$)/g, '');
	process.env.PROJECT_SRC = path.join(projectRoot, 'src');

	return storybookBaseConfig;
}
