import { toArray } from './misc.js'
import { getTasks } from './getters.js'

/**
 * @typedef {import('../../types.d').IScriptDef} IScriptDef
 */

/**
 * @typedef {import('../../types.d').ScriptTaskDef} ScriptTaskDef
 */

/**
 * Validate script tasks.
 * @param {string} scriptName
 * @param {ScriptTaskDef | ScriptTaskDef[]} tasks
 */
export function validateTasks(scriptName, tasks) {
  toArray(tasks).forEach((task) => {
    const taskType = typeof task

    if (taskType !== 'string' && taskType !== 'function') {
      throw new Error(`Cant run "${taskType}" in "${scriptName}"`)
    }
  })
}

/**
 * Validate script.
 * @param {string} scriptName
 * @param {IScriptDef} script
 */
export function validateScript(scriptName, script) {
  if (!scriptName) {
    throw new Error('Script name is required')
  }

  if (!script) {
    throw new Error(`Unknown script "${scriptName}"`)
  }

  const tasks = getTasks(script)

  validateTasks(scriptName, tasks)
}
