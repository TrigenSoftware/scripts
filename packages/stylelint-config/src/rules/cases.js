/**
 * Identifiers cases matchers
 */

function matcherToPart(matcher) {
	return String(matcher).replace(/(^\/\^?|\$?\/$)/g, '');
}

const pascalCaseMatcher = /^([A-Z][a-z\d]*)+$/;
const camelCaseMatcher = /^[a-z\d]+([A-Z][a-z\d]*)*$/;
const classNameMatcher = new RegExp(`^(${
	matcherToPart(camelCaseMatcher)
}|${
	matcherToPart(pascalCaseMatcher)
}(__${
	matcherToPart(camelCaseMatcher)
}(--${
	matcherToPart(camelCaseMatcher)
})?)?)$`);

module.exports = {
	pascalCaseMatcher,
	camelCaseMatcher,
	classNameMatcher
};
