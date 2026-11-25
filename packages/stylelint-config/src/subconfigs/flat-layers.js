/**
 * Flat Layers Design config
 */

import { join } from 'node:path'
import {
  strictCustomPropertyMatcher,
  strictMediaQueryMatcher
} from './matchers.js'

// The files the flat-layers-design and css-containers skills keep the tokens, the breakpoints,
// the mixins, the container names and the global styles in
const variablesFiles = ['**/variables.css']
const mediaFiles = ['**/media.css']
const mixinsFiles = ['**/mixins.module.css']
const containersFiles = ['**/containers.module.css']
const globalFiles = [
  '**/styles.css',
  '**/globals.css',
  ...variablesFiles,
  ...mixinsFiles
]
const mediaFeatures = [
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'hover',
  'any-hover',
  'pointer',
  'any-pointer',
  'prefers-reduced-motion',
  'prefers-contrast',
  'forced-colors',
  'orientation',
  'aspect-ratio',
  'resolution'
]

export default {
  plugins: [join(import.meta.dirname, '../plugin/index.js')],
  rules: {
    // A kit component's root is `.root`
    'trigen/uikit-module-root': true,
    // Breakpoints and features are custom media of `media.css`, and the theme is the tokens' or,
    // for a picture drawn per theme, the mixins'
    'media-feature-name-disallowed-list': [...mediaFeatures, 'prefers-color-scheme'],
    'at-rule-disallowed-list': ['custom-media'],
    'custom-media-pattern': [
      strictMediaQueryMatcher,
      {
        message: 'Expected custom media query name to be in camelCase and start with "screen" (e.g. "--screenSmUp", "--screenReducedMotion")'
      }
    ],
    // A container's name is a token of `containers.module.css`: an empty list takes no value
    'declaration-property-value-allowed-list': {
      '/^container(-name)?$/': []
    },
    // A module styles its own classes, and the root only while one of them stands, by `:has()`;
    // the chosen theme is read by the mixins alone
    'selector-disallowed-list': [
      [
        '/^:global(?!\\(html\\):has\\()/',
        '/^(:root|html|body)\\b/',
        '/data-theme/'
      ],
      {
        splitList: true
      }
    ],
    // Only a mixin, a utility, has to win over what it stands beside
    'declaration-no-important': true,
    // Colors and easings are tokens
    'color-no-hex': true,
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
      'color-mix',
      'cubic-bezier',
      'steps'
    ]
  },
  overrides: [
    {
      files: variablesFiles,
      rules: {
        'color-no-hex': null,
        'function-disallowed-list': null,
        // A token's name starts with its type: `--colorText`, `--sizeSpace4`
        'custom-property-pattern': [
          strictCustomPropertyMatcher,
          {
            message: 'Expected token name to be in camelCase and start with its type (e.g. "--colorPrimary", "--sizeFont")'
          }
        ]
      }
    },
    {
      files: mediaFiles,
      rules: {
        'media-feature-name-disallowed-list': null,
        'at-rule-disallowed-list': null
      }
    },
    {
      files: mixinsFiles,
      rules: {
        'media-feature-name-disallowed-list': mediaFeatures,
        'declaration-no-important': null
      }
    },
    {
      files: containersFiles,
      rules: {
        'declaration-property-value-allowed-list': null
      }
    },
    {
      files: globalFiles,
      rules: {
        'selector-disallowed-list': null
      }
    }
  ]
}
