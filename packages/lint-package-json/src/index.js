#!/usr/bin/env node
import {
  readOptions,
  alias,
  option
} from 'argue-cli'
import {
  NpmPackageJsonLint,
  write
} from 'npm-package-json-lint'
import baseConfig from '@trigen/npm-package-json-lint-config'
import monorepoConfig from '@trigen/npm-package-json-lint-config/monorepo'

const {
  monorepo,
  ignore = []
} = readOptions(
  option(alias('monorepo', 'm'), Boolean),
  option(alias('ignore', 'i'), Array)
)
const config = monorepo
  ? monorepoConfig
  : baseConfig
const npmPackageJsonLint = new NpmPackageJsonLint({
  cwd: process.cwd(),
  config,
  patterns: ['.'].concat(ignore.map(_ => `!${_}`))
})
const linterOutput = npmPackageJsonLint.lint()

write(linterOutput)

if (linterOutput.errorCount > 0) {
  process.exit(1)
}
