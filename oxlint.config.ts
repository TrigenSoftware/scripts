import { defineConfig } from '@trigen/oxlint'
import baseConfig from '@trigen/oxlint-config'
import testConfig from '@trigen/oxlint-config/test'

export default defineConfig({
  ignorePatterns: ['**/package/'],
  extends: [
    baseConfig,
    testConfig
  ],
  env: {
    node: true
  },
  rules: {
    'eslint/no-console': 'off'
  }
})
