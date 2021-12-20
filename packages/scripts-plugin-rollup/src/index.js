import { sh } from '@trigen/scripts'

/**
 * Run build with Rollup.
 * @returns Task function.
 */
export function rollup() {
  return sh({
    NODE_ENV: process.env.NODE_ENV || 'production'
  }, 'rollup', '-c')
}
