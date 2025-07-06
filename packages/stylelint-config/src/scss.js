/**
 * Export SCSS subconfig
 */

import scssConfig from './subconfigs/scss.js'

export default {
  overrides: [
    {
      files: ['**/*.scss'],
      ...scssConfig
    }
  ]
}
