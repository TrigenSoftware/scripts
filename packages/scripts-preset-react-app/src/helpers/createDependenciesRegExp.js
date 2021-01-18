
function escape(input) {
	return input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function createDependenciesRegExp({
	dependencies = [],
	extensions = []
} = {}) {
	const dependencisPatterns = dependencies.map(
		_ => escape(`node_modules/${_}`)
	);
	const extensionsPatterns = extensions.map(
		_ => `${escape(_)}$`
	);
	const pattern = [
		...dependencisPatterns,
		...extensionsPatterns
	].join(')|(');
	const regExp = new RegExp(`(${pattern})`);

	return regExp;
}
