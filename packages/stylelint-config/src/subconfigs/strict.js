/**
 * Strict config
 */

import { join } from 'node:path'

const systemColors = '/^(AccentColor|AccentColorText|ActiveText|ButtonBorder|ButtonFace|ButtonText|Canvas|CanvasText|Field|FieldText|GrayText|Highlight|HighlightText|LinkText|Mark|MarkText|SelectedItem|SelectedItemText|VisitedText)$/'
const colorValues = [
  'currentcolor',
  'currentColor',
  'transparent',
  'inherit',
  'none',
  systemColors
]
// Values a length needs no token for
const lengthValues = [
  '0',
  '1',
  'auto',
  'none',
  'inherit',
  'normal',
  '/^-?\\d+%$/'
]
// A property here takes a token, a calc of tokens or a value that needs none
const strictValue = [
  [
    '/color$/',
    'fill',
    'stroke',
    'font-family',
    'font-weight',
    'z-index',
    '/^padding/',
    '/^margin/',
    '/^(gap|row-gap|column-gap)$/',
    '/^(inset|top|right|bottom|left)(-|$)/',
    '/radius$/',
    'font-size',
    'line-height',
    'outline-offset',
    'text-underline-offset',
    'text-decoration-thickness',
    '/^scroll-(padding|margin)/'
  ],
  {
    disableFix: true,
    ignoreValues: {
      '': lengthValues,
      '/color$/': colorValues,
      fill: colorValues,
      stroke: colorValues,
      'font-family': ['inherit'],
      'font-weight': ['inherit'],
      // A local order inside a component: the layers across components are tokens
      'z-index': ['auto', '/^-?[0-2]$/']
    }
  }
]

export default {
  plugins: [
    join(import.meta.dirname, '../plugin/index.js'),
    'stylelint-declaration-strict-value',
    'stylelint-plugin-a11y'
  ],
  rules: {
    'scale-unlimited/declaration-strict-value': strictValue,
    'declaration-property-value-disallowed-list': {
      // A color reads a role, which is a `light-dark()` pair of the tokens
      '/^(?!--)/': ['/light-dark\\(/'],
      // No pulls: a box stands where its box stands
      '/^margin/': [
        '/\\*\\s*-1\\b/',
        '/-1\\s*\\*/',
        '/(^|[\\s(,])-(\\d|var)/'
      ]
    },
    'property-disallowed-list': [
      // The shorthand alone: the logical autofix turns `overflow-y` into `overflow-block`, which
      // Safari 18 drops
      'overflow-x',
      'overflow-y',
      'overflow-block',
      'overflow-inline',
      // A mixin is a class in the markup
      'composes'
    ],
    'rule-selector-property-disallowed-list': {
      // The root keeps its scrollbar's room and its scroll anchoring
      '/^(html|:root)\\b|:global\\(html\\)/': [
        'overflow-anchor',
        'scrollbar-gutter',
        'overflow-x',
        'overflow-y',
        'overflow-block'
      ],
      // A block does not place itself: where it stands is its consumer's. Its margin is left out:
      // a root resets the one its element has with `0`, which a list of properties cannot tell
      '/^\\.root(?![\\w-])[^\\s>+~]*$/': [
        'inset',
        '/^inset-/',
        'top',
        'right',
        'bottom',
        'left',
        'z-index'
      ]
    },
    // A thin scrollbar for a mouse alone: add a project's own media through `customMedia`
    'trigen/thin-scrollbar-in-media': true,
    // Every length a token or a calc of tokens, with no number of its own inside
    'trigen/no-bare-length': true,
    // A block's outer margin is its consumer's
    'trigen/no-root-margin': true,
    'a11y/line-height-is-vertical-rhythmed': [
      true,
      {
        severity: 'warning'
      }
    ]
  }
}
