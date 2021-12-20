import { toArray } from './misc.js'

/**
 * @typedef {import('../../types.d').IScriptDef} IScriptDef
 */

/**
 * @typedef {import('../../types.d').ScriptTaskDef} ScriptTaskDef
 */

/**
 * Get title from script definition.
 * @param {IScriptDef} script
 * @returns {string | null} Script title.
 */
export function getTitle(script) {
  return script?.title || null
}

/**
 * Get tasks from script definition.
 * @param {IScriptDef} script
 * @returns {ScriptTaskDef[] | null} Tasks.
 */
export function getTasks(script) {
  const run = script?.run || script

  return run ? toArray(run) : null
}

/**
 * Get parallel flag from script definition.
 * @param {IScriptDef} script
 * @returns {boolean} Parallel flag value.
 */
export function getParallel(script) {
  return script?.parallel || false
}
