#!/usr/bin/env node
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {
  readFile,
  writeFile,
  parseFilesList,
  parseSourcesList,
  getFiles,
  downloadFile,
  askFiles,
  askSource
} from './index.js'

const { PROJECT_FILES_DIR } = process.env
const cwd = PROJECT_FILES_DIR ? join(process.cwd(), PROJECT_FILES_DIR) : process.cwd()
const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const parseFilesListTask = parseFilesList(readFile(join(pkgRoot, 'files.txt'), 'utf8'))
const parseSourcesListTask = parseSourcesList(readFile(join(pkgRoot, 'sources.txt'), 'utf8'))
const [filesList, sourcesList] = await Promise.all([parseFilesListTask, parseSourcesListTask])
const selectedFiles = await askFiles(filesList)
const files = await getFiles(sourcesList, selectedFiles)
let file
let fileSources
const tasks = []

for (file of selectedFiles) {
  fileSources = files.get(file)

  if (!fileSources) {
    tasks.push(writeFile(join(cwd, file), ''))
  } else if (fileSources.length === 1) {
    tasks.push(downloadFile(fileSources[0], cwd))
  } else {
    tasks.push(downloadFile(await askSource(fileSources), cwd))
  }
}

await Promise.all(tasks)
