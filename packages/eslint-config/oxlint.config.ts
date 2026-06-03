import { defineConfig } from '@trigen/oxlint'
import moduleConfig from '@trigen/oxlint-config/module'
import rootConfig from '../../oxlint.config.ts'

export default defineConfig({
  ignorePatterns: ['**/*.d.ts'],
  extends: [
    rootConfig,
    moduleConfig
  ],
  rules: {
    'eslint/no-magic-numbers': 'off',
    'import/no-default-export': 'off',
    'import/no-anonymous-default-export': 'off'
  }
})
