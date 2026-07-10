/**
 * Logical config
 */

export default {
  plugins: ['stylelint-plugin-logical-css'],
  rules: {
    'logical-css/require-logical-properties': [
      true,
      {
        severity: 'warning'
      }
    ],
    'logical-css/require-logical-keywords': [
      true,
      {
        severity: 'warning'
      }
    ],
    'logical-css/require-logical-units': [
      true,
      {
        severity: 'warning'
      }
    ]
  }
}
