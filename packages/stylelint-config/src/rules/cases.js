/**
 * Identifiers cases matchers
 */

function matcherToPart(matcher) {
	return String(matcher).replace(/(^\/\^?|\$?\/$)/g, '');
}

const pascalCaseMatcher = /^([A-Z][a-z\d]*)+$/;
const camelCaseMatcher = /^[a-z\d]+([A-Z][a-z\d]*)*$/;
const classNameCamelCasePart = matcherToPart(camelCaseMatcher);
const classNamePascalCasePart = matcherToPart(pascalCaseMatcher);
const classNameMatcher = new RegExp(
	`^(${classNameCamelCasePart}|${classNamePascalCasePart}(__${classNameCamelCasePart}(--${classNameCamelCasePart})?)?)$`
);

module.exports = {
	pascalCaseMatcher,
	camelCaseMatcher,
	classNameMatcher
};
