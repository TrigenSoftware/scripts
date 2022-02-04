#!/usr/bin/env node
import NpmPackageJsonLint from 'npm-package-json-lint/src/NpmPackageJsonLint.js'
import Reporter from 'npm-package-json-lint/src/Reporter.js'

const monorepo = process.argv.includes('--monorepo')
const config = {
  extends: monorepo
    ? ['@trigen/npm-package-json-lint-config', '@trigen/npm-package-json-lint-config/monorepo']
    : '@trigen/npm-package-json-lint-config'
}
const npmPackageJsonLint = new NpmPackageJsonLint({
  cwd: process.cwd(),
  config,
  patterns: ['.']
})
const linterOutput = npmPackageJsonLint.lint()

Reporter.write(linterOutput)

if (linterOutput.errorCount > 0) {
  process.exit(1)
}
