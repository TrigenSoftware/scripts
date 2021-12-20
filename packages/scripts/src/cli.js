#!/usr/bin/env node
import 'dotenv/config'
import colors from 'picocolors'
import { findImportUpward } from './utils/index.js'
import { Runner } from './Runner.js'

const { red } = colors
const SCRIPTS_FILENAME = 'scripts.js'
const [script, ...argv] = process.argv.slice(2)
const scriptsFile = await findImportUpward(SCRIPTS_FILENAME)
const runner = new Runner(
  (await import(scriptsFile)).default
)

try {
  await runner.run(script, argv)
} catch (err) {
  if (err.message) {
    console.error(red(err.message))
  }

  process.exit(1)
}
