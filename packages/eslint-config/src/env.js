/**
 * Env override
 */

import globals from 'globals'

export default Object.keys(globals).reduce((envs, type) => {
  envs[type] = {
    languageOptions: {
      globals: globals[type]
    }
  }

  return envs
}, {})
