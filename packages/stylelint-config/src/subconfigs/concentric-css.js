/**
 * Our variation of Concentric CSS
 * http://rhodesmill.org/brandon/2011/concentric-css/
 */

export default [
  // CSS Modules
  ['composes'],

  // `all` property
  ['all'],

  // Pointer
  ['pointer-events', 'touch-action'],

  // Placement
  [
    'display',
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'inset',
    'inset-block',
    'inset-block-start',
    'inset-block-end',
    'inset-inline',
    'inset-inline-start',
    'inset-inline-end',
    'z-index',
    'flex',
    'flex-basis',
    'flex-direction',
    'flex-flow',
    'flex-grow',
    'flex-shrink',
    'flex-wrap',
    'grid',
    'grid-area',
    'grid-template',
    'grid-template-areas',
    'grid-template-rows',
    'grid-template-columns',
    'grid-row',
    'grid-row-start',
    'grid-row-end',
    'grid-column',
    'grid-column-start',
    'grid-column-end',
    'grid-auto-rows',
    'grid-auto-columns',
    'grid-auto-flow',
    'grid-gap',
    'grid-row-gap',
    'grid-column-gap',
    'gap',
    'row-gap',
    'column-gap',
    'align-content',
    'align-items',
    'align-self',
    'justify-content',
    'justify-items',
    'justify-self',
    'place-content',
    'place-items',
    'place-self',
    'order',
    'columns',
    'column-fill',
    'column-rule',
    'column-rule-width',
    'column-rule-style',
    'column-rule-color',
    'column-span',
    'column-count',
    'column-width',
    'float',
    'clear',
    'transform',
    'transform-origin',
    'transform-style',
    'perspective',
    'perspective-origin',
    'backface-visibility'
  ],

  // Animation
  [
    'will-change',
    'transition',
    'transition-property',
    'transition-duration',
    'transition-timing-function',
    'transition-delay',
    'animation',
    'animation-name',
    'animation-duration',
    'animation-timing-function',
    'animation-delay',
    'animation-iteration-count',
    'animation-direction',
    'animation-fill-mode',
    'animation-play-state'
  ],

  // Visibility
  [
    'visibility',
    'appearance',
    'opacity',
    'filter',
    'backdrop-filter',
    'mix-blend-mode',
    'isolation',
    'clip-path',
    'mask',
    'mask-clip',
    'mask-composite',
    'mask-image',
    'mask-mode',
    'mask-origin',
    'mask-position',
    'mask-repeat',
    'mask-size'
  ],

  // Container Queries
  [
    'container',
    'container-name',
    'container-type'
  ],

  // Box
  [
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'margin-block',
    'margin-block-start',
    'margin-block-end',
    'margin-inline',
    'margin-inline-start',
    'margin-inline-end',
    'box-shadow',
    'box-sizing',
    'outline',
    'outline-offset',
    'outline-width',
    'outline-style',
    'outline-color',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-block',
    'border-block-start',
    'border-block-end',
    'border-inline',
    'border-inline-start',
    'border-inline-end',
    'border-width',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-block-width',
    'border-block-start-width',
    'border-block-end-width',
    'border-inline-width',
    'border-inline-start-width',
    'border-inline-end-width',
    'border-style',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-block-style',
    'border-block-start-style',
    'border-block-end-style',
    'border-inline-style',
    'border-inline-start-style',
    'border-inline-end-style',
    'border-radius',
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
    'border-start-start-radius',
    'border-start-end-radius',
    'border-end-start-radius',
    'border-end-end-radius',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-block-color',
    'border-block-start-color',
    'border-block-end-color',
    'border-inline-color',
    'border-inline-start-color',
    'border-inline-end-color',
    'border-image',
    'border-image-source',
    'border-image-slice',
    'border-image-width',
    'border-image-outset',
    'border-image-repeat',
    'background',
    'background-attachment',
    'background-clip',
    'background-color',
    'background-image',
    'background-origin',
    'background-repeat',
    'background-position',
    'background-position-x',
    'background-position-y',
    'background-size',
    'background-blend-mode',
    'cursor',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'padding-block',
    'padding-block-start',
    'padding-block-end',
    'padding-inline',
    'padding-inline-start',
    'padding-inline-end'
  ],

  // Dimensions
  [
    'aspect-ratio',
    'width',
    'min-width',
    'max-width',
    'height',
    'min-height',
    'max-height',
    'block-size',
    'min-block-size',
    'max-block-size',
    'inline-size',
    'min-inline-size',
    'max-inline-size',
    'overflow',
    'overflow-x',
    'overflow-y',
    'overflow-anchor',
    'overflow-wrap',
    'resize',
    'object-fit',
    'object-position',
    'list-style',
    'list-style-type',
    'list-style-position',
    'list-style-image',
    'caption-side',
    'table-layout',
    'border-collapse',
    'border-spacing',
    'empty-cells'
  ],

  // Scroll
  [
    'scroll-behavior',
    'scroll-margin',
    'scroll-margin-top',
    'scroll-margin-right',
    'scroll-margin-bottom',
    'scroll-margin-left',
    'scroll-padding',
    'scroll-padding-top',
    'scroll-padding-right',
    'scroll-padding-bottom',
    'scroll-padding-left',
    'scroll-snap-type',
    'scroll-snap-align',
    'scroll-snap-stop',
    'scrollbar-width',
    'scrollbar-color',
    'overscroll-behavior',
    'overscroll-behavior-x',
    'overscroll-behavior-y'
  ],

  // Text
  [
    'vertical-align',
    'text-align',
    'text-align-last',
    'text-indent',
    'text-transform',
    'text-decoration',
    'text-decoration-line',
    'text-decoration-color',
    'text-decoration-style',
    'text-decoration-thickness',
    'text-underline-offset',
    'text-underline-position',
    'text-rendering',
    'text-shadow',
    'text-overflow',
    'text-emphasis',
    'text-emphasis-color',
    'text-emphasis-style',
    'text-emphasis-position',
    'line-height',
    'word-break',
    'word-wrap',
    'word-spacing',
    'letter-spacing',
    'white-space',
    'tab-size',
    'hyphens',
    'writing-mode',
    'direction',
    'unicode-bidi',
    'text-orientation',
    'text-combine-upright',
    'user-select',
    'color',
    'font',
    'font-family',
    'font-size',
    'font-weight',
    'font-smoothing',
    'font-style',
    'font-variant',
    'font-variant-caps',
    'font-variant-numeric',
    'font-variant-ligatures',
    'font-stretch',
    'font-display',
    'font-feature-settings',
    'font-variation-settings',
    'content',
    'quotes',
    'counter-reset',
    'counter-increment'
  ]
]
