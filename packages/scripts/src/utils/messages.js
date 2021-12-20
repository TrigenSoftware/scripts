import colors from 'picocolors'

const { blue } = colors

/**
 * Print title to console.
 * @param {string} title - Title to print.
 * @param {string} [postfix] - Title postfix to print.
 */
export function printTitle(title, postfix) {
  console.log(blue(`> ${title}${postfix ? ` ${postfix}` : ''}`))
}
