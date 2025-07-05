export const configFiles = ['**/*.config.{c,m,}{js,ts}', '**/.*rc.{c,m,}{js,ts}']

export const commonjsFiles = ['**/*.c{js,ts}']

export const tsFiles = ['**/*.{c,m,}ts{x,}']

export const dtsFiles = ['**/*.d.{c,m,}ts']

export const moduleFiles = ['**/*.m{js,ts}']

export const testFiles = ['**/*.{spec,mock}.{js,ts}{x,}']

export const storiesFiles = ['**/*.stories.{js,ts}{x,}', '.storybook/**/*']

export const jsxFiles = ['**/*.{js,ts}x']

export const hooksFiles = ['**/hooks/*.{js,ts}{x,}']

export const reactFiles = [...jsxFiles, ...hooksFiles]
