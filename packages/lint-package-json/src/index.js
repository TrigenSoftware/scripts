#!/usr/bin/env node
import {
  readOptions,
  alias,
  option
} from 'argue-cli'
import NpmPackageJsonLint from 'npm-package-json-lint/src/NpmPackageJsonLint.js'
import Reporter from 'npm-package-json-lint/src/Reporter.js'
import configs from './configs.cjs'

const {
  monorepo,
  ignore
} = readOptions(
  option(alias('monorepo', 'm'), Boolean),
  option(alias('ignore', 'i'), Array),
)
const config = {
  extends: monorepo
    ? [configs.base, configs.monorepo]
    : configs.base
}
const npmPackageJsonLint = new NpmPackageJsonLint({
  cwd: process.cwd(),
  config,
  patterns: ['.'].concat(ignore.map(_ => `!${_}`))
})
const linterOutput = npmPackageJsonLint.lint()

Reporter.write(linterOutput)

if (linterOutput.errorCount > 0) {
  process.exit(1)
}
