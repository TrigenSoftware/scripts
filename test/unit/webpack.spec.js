import {
	dev,
	build,
	render
} from '../../packages/scripts-preset-react-app/src/webpack';

describe('@trigen/scripts-preset-react-app', () => {
	describe('webpack', () => {
		it('should place dev plugins in correct order', () => {
			const plugins = dev().plugins.map(_ => _.constructor.name);

			expect(plugins).toMatchSnapshot();
		});

		it('should place build plugins in correct order', () => {
			const plugins = build().plugins.map(_ => _.constructor.name);

			expect(plugins).toMatchSnapshot();
		});

		it('should place render plugins in correct order', () => {
			const plugins = render().plugins.map(_ => _.constructor.name);

			expect(plugins).toMatchSnapshot();
		});
	});
});
