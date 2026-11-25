/**
 * Check if a node stands in a media query that matches a feature or names one of the custom media.
 * @param {object} node - A rule or a declaration.
 * @param {RegExp} featurePattern - The standard feature, such as `(hover: hover)`.
 * @param {string[]} customMedia - The names of the custom media that mean the same.
 * @returns {boolean} Whether a media query around it matches.
 */
export function isInMedia(node, featurePattern, customMedia) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      parent.type === 'atrule'
      && parent.name.toLowerCase() === 'media'
      && (
        featurePattern.test(parent.params)
        || customMedia.some(name => parent.params.includes(`(${name})`))
      )
    ) {
      return true
    }
  }

  return false
}

export function toList(value) {
  if (value === undefined) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export function isString(value) {
  return typeof value === 'string'
}
