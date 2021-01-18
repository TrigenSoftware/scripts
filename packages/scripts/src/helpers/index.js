
export const FILL_ME = [/* FILL ME */];

export function getScriptArg(args, arg, value) {
	if (typeof arg === 'number') {
		if (arg >= args.length || args[arg][0] === '-') {
			return [value];
		}
	} else
	if (!args.includes(arg)) {
		return typeof value !== 'undefined'
			? [arg, value]
			: [arg];
	}

	return [];
}

export function addScripts(items, add, scripts, unshift) {
	let addList = Array.isArray(add)
		? add.slice()
		: [add];

	if (scripts) {
		addList = addList.filter(_ => _ in scripts);
	}

	if (!items) {
		return addList;
	}

	const itemsList = Array.isArray(items)
		? items.slice()
		: [items];

	if (unshift) {
		addList = addList.reverse();
	}

	addList.forEach((add) => {
		if (!itemsList.includes(add)) {
			if (unshift) {
				itemsList.unshift(add);
			} else {
				itemsList.push(add);
			}
		}
	});

	return itemsList;
}

export function saveScripts(scriptNames, nextScripts, prevScripts) {
	return scriptNames.reduce((scripts, name) => {
		if (prevScripts[name]) {
			return {
				...scripts,
				[name]: prevScripts[name]
			};
		}

		return scripts;
	}, nextScripts);
}
