import { resolve } from 'path'
import { diff as jestDiff } from 'jest-diff'

export function diff() {
  return async ({ args: [fileA, fileB] }) => {
    const [moduleA, moduleB] = await Promise.all([import(resolve(fileA)), import(resolve(fileB))])

    return jestDiff(moduleA, moduleB)
  }
}
