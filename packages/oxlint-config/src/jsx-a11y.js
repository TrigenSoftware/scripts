/**
 * JSX accessibility override
 */

import { jsxFiles } from './subconfigs/files.js'

export default {
  overrides: [
    {
      // The recommended set of eslint-plugin-jsx-a11y, with its options, and the rules it leaves
      // out but one
      files: jsxFiles,
      plugins: ['jsx-a11y'],
      rules: {
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/anchor-ambiguous-text': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-role': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/autocomplete-valid': 'error',
        'jsx-a11y/click-events-have-key-events': 'error',
        'jsx-a11y/control-has-associated-label': 'error',
        'jsx-a11y/heading-has-content': 'error',
        'jsx-a11y/html-has-lang': 'error',
        'jsx-a11y/iframe-has-title': 'error',
        'jsx-a11y/img-redundant-alt': 'error',
        'jsx-a11y/interactive-supports-focus': [
          'error',
          {
            tabbable: [
              'button',
              'checkbox',
              'link',
              'searchbox',
              'spinbutton',
              'switch',
              'textbox'
            ]
          }
        ],
        'jsx-a11y/label-has-associated-control': 'error',
        'jsx-a11y/lang': 'error',
        'jsx-a11y/media-has-caption': 'error',
        'jsx-a11y/mouse-events-have-key-events': 'error',
        'jsx-a11y/no-access-key': 'error',
        'jsx-a11y/no-aria-hidden-on-focusable': 'error',
        'jsx-a11y/no-autofocus': 'error',
        'jsx-a11y/no-distracting-elements': 'error',
        'jsx-a11y/no-interactive-element-to-noninteractive-role': [
          'error',
          {
            tr: ['none', 'presentation'],
            canvas: ['img']
          }
        ],
        'jsx-a11y/no-noninteractive-element-interactions': [
          'error',
          {
            handlers: [
              'onClick',
              'onError',
              'onLoad',
              'onMouseDown',
              'onMouseUp',
              'onKeyPress',
              'onKeyDown',
              'onKeyUp'
            ],
            alert: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
            body: ['onError', 'onLoad'],
            dialog: ['onKeyDown', 'onKeyUp', 'onKeyPress'],
            iframe: ['onError', 'onLoad'],
            img: ['onError', 'onLoad']
          }
        ],
        'jsx-a11y/no-noninteractive-element-to-interactive-role': [
          'error',
          {
            ul: [
              'listbox',
              'menu',
              'menubar',
              'radiogroup',
              'tablist',
              'tree',
              'treegrid'
            ],
            ol: [
              'listbox',
              'menu',
              'menubar',
              'radiogroup',
              'tablist',
              'tree',
              'treegrid'
            ],
            li: [
              'menuitem',
              'menuitemradio',
              'menuitemcheckbox',
              'option',
              'row',
              'tab',
              'treeitem'
            ],
            table: ['grid'],
            td: ['gridcell'],
            fieldset: ['radiogroup', 'presentation']
          }
        ],
        'jsx-a11y/no-noninteractive-tabindex': [
          'error',
          {
            tags: [],
            // A scroller with nothing focusable in it takes a Tab stop of its own as a named region
            roles: ['tabpanel', 'region'],
            allowExpressionValues: true
          }
        ],
        // A list drawn with no markers keeps `role='list'`: Safari drops the list's role without it
        'jsx-a11y/no-redundant-roles': [
          'error',
          {
            ul: ['list'],
            ol: ['list']
          }
        ],
        'jsx-a11y/no-static-element-interactions': [
          'error',
          {
            allowExpressionValues: true,
            handlers: [
              'onClick',
              'onMouseDown',
              'onMouseUp',
              'onKeyPress',
              'onKeyDown',
              'onKeyUp'
            ]
          }
        ],
        // A role on an element of another tag is chosen: the tag's own would bring its look or its
        // behavior, a fieldset's border, an output's place in its form
        'jsx-a11y/prefer-tag-over-role': 'off',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
        'jsx-a11y/scope': 'error',
        'jsx-a11y/tabindex-no-positive': 'error'
      }
    }
  ]
}
