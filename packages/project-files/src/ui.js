import inquirer from 'inquirer'

/**
 * @typedef {import('./parse.js').FileItem} FileItem
 */

/**
 * Ask files to get.
 * @param {FileItem[]} files
 * @returns {Promise<string[]>} Selected files.
 */
export async function askFiles(files) {
  let separator
  const choices = files.reduce((choices, { type, path }) => {
    if (separator !== type) {
      separator = type
      choices.push(new inquirer.Separator(type))
    }

    choices.push(path)

    return choices
  }, [])
  const result = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'files',
        message: 'Select files to get',
        pageSize: 20,
        choices
      }
    ])

  return result.files
}

/**
 * @typedef {import('./api.js').RepoFile} RepoFile
 */

/**
 * Ask source to use.
 * @param {RepoFile[]} sources
 * @returns {Promise<RepoFile>} Selected source.
 */
export async function askSource(sources) {
  const choices = sources.map(_ => ({
    name: _.html_url,
    value: _
  }))
  const result = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'source',
        message: `Select source of ${sources[0].path}`,
        pageSize: 20,
        choices
      }
    ])

  return result.source
}
