const LETTER_PATTERN = /\p{L}/gu
// A letter of any script but Latin
const NON_LATIN_LETTER_PATTERN = /(?=\p{L})\P{Script=Latin}/gu

// Most of its letters are of another script: a word quoted from another language, such as
// "日本語", leaves an English comment English
function isInAnotherLanguage(text) {
  const letters = text.match(LETTER_PATTERN)?.length ?? 0
  const nonLatinLetters = text.match(NON_LATIN_LETTER_PATTERN)?.length ?? 0

  return nonLatinLetters * 2 > letters
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require comments in English: most of a comment\'s letters are Latin.'
    },
    schema: []
  },
  create(context) {
    return {
      Program() {
        context.sourceCode.getAllComments().forEach((comment) => {
          if (isInAnotherLanguage(comment.value)) {
            context.report({
              loc: comment.loc,
              message: 'Write comments in English.'
            })
          }
        })
      }
    }
  }
}
