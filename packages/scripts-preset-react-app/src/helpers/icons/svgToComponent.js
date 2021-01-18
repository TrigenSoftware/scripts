import path from 'path';
import {
	stringifySymbol,
	generateImport,
	generateExport
} from 'svg-sprite-loader/lib/utils';
import {
	stringifyRequest
} from 'loader-utils';
import {
	pascalize
} from 'humps';

module.exports = runtimeGenerator;

function createRequest(context, module) {
	return stringifyRequest({
		context
	}, module).replace(/^"(\.\.\/)*node_modules\//g, '"');
}

function runtimeGenerator({
	symbol,
	config
}) {
	const {
		spriteModule,
		symbolModule,
		runtimeOptions,
		esModule // ?
	} = config;
	const {
		iconModule,
		skipSymbol
	} = runtimeOptions;
	const context = path.dirname(symbol.request.file);
	const iconRequest = createRequest(context, iconModule);
	const spriteRequest = createRequest(context, spriteModule);
	const symbolRequest = createRequest(context, symbolModule);
	const displayName = `Icon${pascalize(symbol.id)}`;
	const [,, width, height] = symbol.viewBox.split(' ');

	return `
		${generateImport('React', 'react', esModule)}
		${generateImport('SpriteSymbol', symbolRequest, esModule)}
		${generateImport('sprite', spriteRequest, esModule)}
		${generateImport(esModule ? 'Icon' : '{ default: Icon }', iconRequest, esModule)}

		${skipSymbol ? '' : `
		sprite.add(new SpriteSymbol(${stringifySymbol(symbol)}));
		`}

		function ${displayName}(props) {
			return React.createElement(Icon, props);
		}

		${displayName}.defaultProps = {
			glyph:  '${symbol.id}',
			width:  ${width},
			height: ${height}
		};

		${generateExport(displayName, esModule)}
	`;
}
