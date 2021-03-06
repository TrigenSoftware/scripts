#!/bin/bash

set -e

rm -rf package
cp -R src package

tsfiles=(`find ./package \( -name "*.ts" -o -name "*.tsx" \)`)

if [ ${#tsfiles[@]} -gt 0 ]; then
	del 'package/**/*.{ts,tsx}'
	tsc --rootDir src --outDir package

	icons=package/helpers/icons

	if [ -f "$icons/IconComponent.jsx" ]; then
		cp $icons/IconComponent.jsx $icons/IconComponent.babel.js
	fi
fi

if [[ $PWD != *"-config"* && $PWD != *"babel-preset"* ]]; then
	NODE_ENV=production babel --root-mode upward ./package -d ./package -s inline
fi

del 'package/**/*.jsx'
rm -rf package/.eslintrc
cp README.md package/
cp package.json package/
../../scripts/transformPackage.js package/package.json
cp ../../LICENSE package/
