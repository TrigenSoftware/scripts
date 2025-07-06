/**
 * Strict config
 */

import {
  strictCustomPropertyMatcher,
  strictMediaQueryMatcher
} from './matchers.js'

export default {
  plugins: ['stylelint-declaration-strict-value', 'stylelint-plugin-a11y'],
  rules: {
    'scale-unlimited/declaration-strict-value': [
      ['font-family', '/color([^A-Z]|$)/'],
      {
        disableFix: true,
        ignoreKeywords: [
          'currentColor',
          'transparent',
          'inherit'
        ]
      }
    ],
    'a11y/line-height-is-vertical-rhythmed': [
      true,
      {
        severity: 'warning'
      }
    ],
    'custom-property-pattern': [
      strictCustomPropertyMatcher,
      {
        message: 'Expected custom property name to be in camelCase (e.g. "--colorPrimary", "--sizeFont")'
      }
    ],
    'custom-media-pattern': [
      strictMediaQueryMatcher,
      {
        message: 'Expected custom media query name to be in camelCase (e.g. "--mediaSmallScreen", "--mediaTabletAndUp")'
      }
    ]
  }
}
