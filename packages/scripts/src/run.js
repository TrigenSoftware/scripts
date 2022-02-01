#!/usr/bin/env node
import 'dotenv/config'
import {
  readOptions,
  alias,
  option
} from 'argue-cli'
import {
  detectPackageManager,
  readScripts,
  runParallel,
  runSerial
} from './utils/index.js'

const pm = detectPackageManager()
const { parallel } = readOptions(
  option(alias('parallel', 'p'), Boolean),
)
const scripts = readScripts()

if (parallel) {
  process.exit(await runParallel(pm, scripts))
} else {
  process.exit(await runSerial(pm, scripts))
}
