import React from 'react';
import {
	configure as configureStorybook,
	addParameters,
	addDecorator
} from '@storybook/react';
import {
	withInfo
} from '@storybook/addon-info';
import {
	withKnobs
} from '@storybook/addon-knobs';
import {
	withA11y
} from '@storybook/addon-a11y';

addParameters({
	options: {
		brandTitle: process.env.PROJECT_NAME,
		brandUrl: process.env.PROJECT_HOMEPAGE,
		panelPosition: 'right'
	}
});

addDecorator(story => (
	<div
		style={{
			padding: '12px'
		}}
	>
		{story()}
	</div>
));
addDecorator(withInfo);
addDecorator(withKnobs);
addDecorator(withA11y);

export function configure(module, inputStories) {
	let stories = inputStories;

	if (!stories) {
		stories = require.context(
			process.env.PROJECT_SRC,
			true,
			/\.stories\.tsx$/
		);
	}

	function loadStories() {
		stories.keys().forEach(filename => stories(filename));
	}

	configureStorybook(loadStories, module);
}

if (process.env.STORYBOOK_AUTO_CONFIGURE === 'true') {
	configure(module);
}
