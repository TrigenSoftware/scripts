exports.makePatterns = (postfixes, extensions) => postfixes.reduce(
  (patterns, postfix) => [...patterns, ...extensions.map(extension => `*.${postfix}.${extension}`)],
  []
)
