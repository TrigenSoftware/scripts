/**
 * Our variation of Concentric CSS
 * http://rhodesmill.org/brandon/2011/concentric-css/
 */

module.exports = [
	// `all` property
	[
		'all'
	],

	// Pointer
	[
		'pointer-events',
		'touch-action'
	],

	// Placement
	[
		'composes',
		'display',
		'position',
		'top',
		'right',
		'bottom',
		'left',
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
		'align-content',
		'align-items',
		'align-self',
		'justify-content',
		'justify-items',
		'justify-self',
		'order',
		'columns',
		'column-gap',
		'column-fill',
		'column-rule',
		'column-span',
		'column-count',
		'column-width',
		'float',
		'clear',
		'transform'
	],

	// Animation
	[
		'will-change',
		'transition',
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
		'opacity'
	],

	// Box
	[
		'margin',
		'margin-top',
		'margin-right',
		'margin-bottom',
		'margin-left',
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
		'border-width',
		'border-top-width',
		'border-right-width',
		'border-bottom-width',
		'border-left-width',
		'border-style',
		'border-top-style',
		'border-right-style',
		'border-bottom-style',
		'border-left-style',
		'border-radius',
		'border-top-left-radius',
		'border-top-right-radius',
		'border-bottom-left-radius',
		'border-bottom-right-radius',
		'border-color',
		'border-top-color',
		'border-right-color',
		'border-bottom-color',
		'border-left-color',
		'background',
		'background-attachment',
		'background-clip',
		'background-color',
		'background-image',
		'background-repeat',
		'background-position',
		'background-size',
		'cursor',
		'padding',
		'padding-top',
		'padding-right',
		'padding-bottom',
		'padding-left'
	],

	// Dimensions
	[
		'width',
		'min-width',
		'max-width',
		'height',
		'min-height',
		'max-height',
		'overflow',
		'list-style',
		'caption-side',
		'table-layout',
		'border-collapse',
		'border-spacing',
		'empty-cells'
	],

	// Text
	[
		'vertical-align',
		'text-align',
		'text-indent',
		'text-transform',
		'text-decoration',
		'text-rendering',
		'text-shadow',
		'text-overflow',
		'line-height',
		'word-break',
		'word-wrap',
		'word-spacing',
		'letter-spacing',
		'white-space',
		'color',
		'font',
		'font-family',
		'font-size',
		'font-weight',
		'font-smoothing',
		'font-style',
		'content',
		'quotes'
	]
];
