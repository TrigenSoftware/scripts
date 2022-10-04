/**
 * @typedef FileItem
 * @property {string} type - File type description
 * @property {string} path - File path
 */

/**
 * Parse files list file.
 * @param {string | Promise<string>} contents
 * @returns {Promise<FileItem[]>} Parsed files info.
 */
export async function parseFilesList(contents) {
  const text = await contents
  const files = []
  let type

  text.split('\n').forEach((line) => {
    if (line[0] === '#') {
      type = line.slice(2)
    } else if (line) {
      files.push({
        type,
        path: line
      })
    }
  })

  return files
}

/**
 * @typedef SourceItem
 * @property {string} owner - Source repository owner
 * @property {string} repo - Source repository name
 */

/**
 * Parse sources list file.
 * @param {string | Promise<string>} contents
 * @returns {Promise<SourceItem[]>} Parsed sources info.
 */
export async function parseSourcesList(contents) {
  const text = await contents
  const sources = []
  let owner
  let repo

  text.split('\n').forEach((line) => {
    if (line) {
      [owner, repo] = line.split('/')
      sources.push({
        owner,
        repo
      })
    }
  })

  return sources
}
