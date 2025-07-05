import { dirname, join } from 'path'
import { Octokit } from '@octokit/rest'
import { writeFile } from './fs.js'

/**
 * @typedef {import('./parse.js').SourceItem} Repo
 */

const OK = 200
const { GITHUB_TOKEN } = process.env
const client = new Octokit({
  auth: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : ''
})

/**
 * @typedef RepoFile
 * @property {string} path - File path.
 * @property {string} name - File name.
 * @property {string} sha - The SHA of the file.
 * @property {string} download_url - Download url.
 * @property {string} html_url - Html url.
 */

/**
 * Get files list from repository.
 * @param {Repo} repo
 * @param {string} path
 * @returns {Promise<RepoFile[]>} File from the repository.
 */
export async function getDirectory(repo, path) {
  let status
  let data

  try {
    ({
      status,
      data
    } = await client.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: repo.owner,
      repo: repo.repo,
      path: path === '.' ? '' : path
    }))
  } catch {
    return []
  }

  if (status !== OK || !data) {
    return []
  }

  return data
}

/**
 * Get files filtered by sha from repository.
 * @param {Repo[]} repos
 * @param {string[]} paths
 * @returns {Promise<Map<string, RepoFile[]>>} Files from the repository.
 */
export async function getFiles(repos, paths) {
  const dirs = new Set()
  const tasks = []
  const shas = []
  const filesMap = new Map()
  let task
  let dir
  let file
  let sha
  let files

  paths.forEach((path) => {
    dirs.add(dirname(path))
  })

  repos.forEach((repo) => {
    dirs.forEach((dir) => {
      tasks.push(getDirectory(repo, dir))
    })
  })

  for (task of tasks) {
    dir = await task

    for (file of dir) {
      if (paths.includes(file.path)) {
        sha = file.sha + file.path

        if (!shas.includes(sha)) {
          shas.push(sha)

          files = filesMap.get(file.path)

          if (!files) {
            files = []
            filesMap.set(file.path, files)
          }

          files.push(file)
        }
      }
    }
  }

  return filesMap
}

/**
 * Download file.
 * @param {RepoFile} file
 * @param {boolean | string} write
 * @returns {Promise<string>} File contents.
 */
export async function downloadFile(file, write) {
  const { data } = await client.request(`GET ${file.download_url}`)

  if (write) {
    await writeFile(
      join(
        write === true
          ? '.'
          : write,
        file.path
      ),
      data
    )
  }

  return data
}
