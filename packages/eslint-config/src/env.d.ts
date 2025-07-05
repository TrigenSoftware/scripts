import type { ESLint } from 'eslint'
import type globals from 'globals'

type FlatConfig = ESLint.ConfigData

declare const config: Record<keyof typeof globals, FlatConfig>

export default config;
