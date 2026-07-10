import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import {
  mkdtemp,
  readFile,
  rm,
  writeFile
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import {
  join,
  resolve
} from 'node:path'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const currentDir = fileURLToPath(new URL('.', import.meta.url))
const oxlintBinPath = resolve(currentDir, '../../../../node_modules/oxlint/bin/oxlint')
const pluginPath = resolve(currentDir, 'index.js')

async function execOxlint(args, cwd) {
  try {
    const { stdout } = await execFileAsync(process.execPath, [oxlintBinPath, ...args], {
      cwd
    })

    return stdout
  } catch (error) {
    if (typeof error.stdout === 'string' && error.stdout !== '') {
      return error.stdout
    }

    throw error
  }
}

function parseDiagnostics(output) {
  try {
    return JSON.parse(output).diagnostics
  } catch {
    throw new Error(`Unexpected oxlint output: ${output}`)
  }
}

function getOffset(diagnostic) {
  return diagnostic.labels[0]?.span.offset ?? 0
}

function groupMessagesByFile(diagnostics, fileNames) {
  const messages = Object.fromEntries(fileNames.map(fileName => [fileName, []]))

  diagnostics
    .sort((left, right) => getOffset(left) - getOffset(right))
    .forEach((diagnostic) => {
      const fileName = fileNames.find(name => diagnostic.filename === name
        || diagnostic.filename.endsWith(`/${name}`))

      messages[fileName]?.push(diagnostic.message)
    })

  return messages
}

async function runOxlint(rules, files, fix) {
  const tempDir = await mkdtemp(join(tmpdir(), 'trigen-oxlint-rule-'))

  try {
    const fileNames = Object.keys(files)
    const config = {
      categories: {
        correctness: 'off'
      },
      jsPlugins: [pluginPath],
      rules
    }

    await writeFile(join(tempDir, '.oxlintrc.json'), JSON.stringify(config))
    await Promise.all(
      fileNames.map(fileName => writeFile(join(tempDir, fileName), files[fileName]))
    )

    const output = await execOxlint(
      [
        '-c',
        '.oxlintrc.json',
        '--format',
        'json',
        ...fix ? ['--fix'] : [],
        ...fileNames
      ],
      tempDir
    )
    const messages = groupMessagesByFile(parseDiagnostics(output), fileNames)

    if (!fix) {
      return messages
    }

    const contents = Object.fromEntries(await Promise.all(
      fileNames.map(async fileName => [fileName, await readFile(join(tempDir, fileName), 'utf-8')])
    ))

    return {
      messages,
      files: contents
    }
  } finally {
    await rm(tempDir, {
      recursive: true,
      force: true
    })
  }
}

/**
 * Lint fixture files with given rules and collect rule messages per file.
 * @param {object} rules - Oxlint rules config entries.
 * @param {object} files - Fixture file contents by file name.
 * @returns {Promise<object>} Report messages by file name.
 */
export function lint(rules, files) {
  return runOxlint(rules, files, false)
}

/**
 * Lint fixture files with autofix and collect fixed contents per file.
 * @param {object} rules - Oxlint rules config entries.
 * @param {object} files - Fixture file contents by file name.
 * @returns {Promise<object>} Report messages and fixed contents by file name.
 */
export function lintWithFix(rules, files) {
  return runOxlint(rules, files, true)
}
