import { cpus } from 'os'
import pLimit from 'p-limit'
import {
  getTitle,
  getTasks,
  getParallel,
  validateScript,
  printTitle
} from './utils/index.js'
import { SilentError, OutputError } from './errors/index.js'

/**
 * @typedef {import('../types.d').IScriptDef} IScriptDef
 */

/**
 * @typedef {import('../types.d').ScriptTaskDef} ScriptTaskDef
 */

/**
 * @typedef {import('../types.d').IScriptTaskContext} IScriptTaskContext
 */

/**
 * Scripts runner.
 */
export class Runner {
  /**
   * @param {Record<string, IScriptDef>} scripts - Scripta map.
   */
  constructor(scripts) {
    this.scripts = scripts
    this.inParallel = false
    this.limit = pLimit(cpus().length)
    this.isOutputEnabled = process.env.NODE_ENV !== 'test'
  }

  /**
   * Get task context information.
   * @private
   * @param {string[]} [argv]
   * @returns {IScriptTaskContext} Task context information.
   */
  getContext(argv = []) {
    return {
      stdio: !this.inParallel,
      argv
    }
  }

  /**
   * Set inParallel flag.
   * @private
   * @param {boolean} parallel
   * @returns Function to restore value.
   */
  setInParallel(parallel) {
    const prevInParallel = this.inParallel

    this.inParallel = parallel || prevInParallel

    return () => {
      this.inParallel = prevInParallel
    }
  }

  /**
   * Run script by name.
   * @private
   * @param {string} scriptName
   * @param {string[]} [argv]
   */
  async runScript(scriptName, argv) {
    const script = this.scripts[scriptName]

    validateScript(scriptName, script)

    const { isOutputEnabled } = this
    const title = getTitle(script)
    const showTitle = Boolean(title)
    const tasks = getTasks(script)
    const parallel = getParallel(script)
    const restoreInParallel = this.setInParallel(parallel)
    let output = ''
    let error = false

    if (isOutputEnabled && showTitle) {
      printTitle(title, '⏳')
    }

    try {
      output = parallel
        ? await this.runParallelTasks(tasks, argv)
        : await this.runSerialTasks(tasks, argv)
    } catch (err) {
      error = true

      if (!(err instanceof OutputError)) {
        if (isOutputEnabled) {
          console.error(err)
        }
      } else
      if (this.inParallel) {
        output = err.message
      }
    }

    if (isOutputEnabled && output) {
      console.log(output.trim())
    }

    if (isOutputEnabled && showTitle) {
      printTitle(title, error ? '❌' : '✅')
    }

    restoreInParallel()

    if (error) {
      throw new SilentError()
    }
  }

  /**
   * Run tasks in serial.
   * @private
   * @param {ScriptTaskDef[]} tasks
   * @param {string[]} [argv]
   * @returns {Promise<string>} Output.
   */
  async runSerialTasks(tasks, argv) {
    let output = ''

    for (const task of tasks) {
      output += await this.runTask(task, argv) || ''
    }

    return output
  }

  /**
   * Run tasks in parallel.
   * @private
   * @param {ScriptTaskDef[]} tasks
   * @param {string[]} [argv]
   * @returns {Promise<string>} Output.
   */
  async runParallelTasks(tasks, argv) {
    const outputs = await Promise.all(tasks.map(task => this.runTask(task, argv)))

    return outputs.filter(Boolean).join('')
  }

  /**
   * Run task.
   * @private
   * @param {ScriptTaskDef} task
   * @param {string[]} [argv]
   * @returns {Promise<string | null>} Output.
   */
  async runTask(task, argv) {
    if (typeof task === 'string') {
      await this.runScript(task, argv)
      return null
    }

    return await this.limit(() => task(this.getContext(argv)))
  }

  /**
   * Run script by name.
   * @param {string} script
   * @param {string[]} [argv]
   */
  async run(script, argv) {
    await this.runScript(script, argv)
  }
}
