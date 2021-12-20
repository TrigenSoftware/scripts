/**
 * Task context information.
 */
export interface IScriptTaskContext {
  /**
   * Use stdio to logs.
   */
  stdio: boolean
  /**
   * Arguments.
   */
  argv: string[]
}

/**
 * Task function.
 */
export type ScriptTask = (ctx: IScriptTaskContext) => string | Promise<string>

/**
 * Script reference string.
 */
export type ScriptRef = string

/**
 * Script task definition.
 */
export type ScriptTaskDef = ScriptRef | ScriptTask

/**
 * Script definition.
 */
export interface IScriptDef {
  /**
   * Script title.
   */
  title?: string
  /**
   * Run tasks in parallel.
   */
  parallel?: boolean
  /**
   * Tasks to run.
   */
  run: ScriptTaskDef | ScriptTaskDef[]
}
