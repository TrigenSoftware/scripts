import {
  describe,
  it,
  expect
} from 'vitest'
import stylelint from 'stylelint'
import plugins from './index.js'

async function lint(rules, code, codeFilename) {
  const { results: [result] } = await stylelint.lint({
    code,
    codeFilename,
    config: {
      plugins,
      rules
    }
  })

  return result.warnings.map(warning => warning.text)
}

describe('stylelint-config', () => {
  describe('plugin', () => {
    describe('focus-includes-hover', () => {
      it('should report a hover declaration no focus rule sets', async () => {
        expect(await lint({
          'trigen/focus-includes-hover': true
        }, '.button:hover { color: red; background: blue; } .button:focus-visible { color: red; }')).toEqual([
          'Set `background: blue` on focus too: a keyboard reaches what a pointer does, so focus styles include the hover ones. (trigen/focus-includes-hover)'
        ])
      })

      it('should allow a hover a focus rule matches under other conditions and media', async () => {
        expect(await lint({
          'trigen/focus-includes-hover': true
        }, [
          '@media (hover: hover) { .button:not(:disabled, [aria-disabled=true]):hover { color: red; } }',
          '.button:not(:disabled):focus-visible { color:  red; }'
        ].join('\n'))).toEqual([])
      })

      it('should allow a hover matched by focus on an input inside', async () => {
        expect(await lint({
          'trigen/focus-includes-hover': true
        }, '.card:hover { color: red; } .card:has(> input:focus-visible) { color: red; }')).toEqual([])
      })

      it('should leave a rule that lists focus beside hover', async () => {
        expect(await lint({
          'trigen/focus-includes-hover': true
        }, '.button:is(:hover, :focus-visible) { color: red; }')).toEqual([])
      })
    })

    describe('no-bare-color-function', () => {
      const message = value => `Expected "${value}" to derive its color from a token: a color function takes only \`var()\`, \`currentcolor\` or \`transparent\`, and a color of its own is a token. (trigen/no-bare-color-function)`

      it('should report a color function with channels of its own', async () => {
        expect(await lint({
          'trigen/no-bare-color-function': true
        }, '.a { color: rgb(12 34 56); background: oklch(0.5 0.1 150); }')).toEqual([
          message('rgb(12 34 56)'),
          message('oklch(0.5 0.1 150)')
        ])
      })

      it('should allow a mix of tokens, the words\' ink and transparent', async () => {
        expect(await lint({
          'trigen/no-bare-color-function': true
        }, [
          '.a { text-decoration-color: color-mix(in srgb, currentcolor 40%, transparent); }',
          '.b { background: color-mix(in oklab, var(--colorScrim) 53%, var(--colorCanvas)); }'
        ].join('\n'))).toEqual([])
      })

      it('should allow a relative color from a token', async () => {
        expect(await lint({
          'trigen/no-bare-color-function': true
        }, '.a { background: rgb(from var(--colorScrim) r g b / calc(alpha * 0.5)); }')).toEqual([])
      })

      it('should report a mix or a relative color with a color of its own', async () => {
        expect(await lint({
          'trigen/no-bare-color-function': true
        }, '.a { color: color-mix(in srgb, red 50%, var(--colorText)); background: rgb(from #fff r g b / 50%); }')).toEqual([
          message('color-mix(in srgb, red 50%, var(--colorText))'),
          message('rgb(from #fff r g b / 50%)')
        ])
      })
    })

    describe('hover-in-media', () => {
      const message = 'Put `:hover` styles in a hover media query, so a tap does not leave a control looking hovered. (trigen/hover-in-media)'

      it('should report hover styles outside a media query', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, '.button:hover { color: red; }')).toEqual([message])
      })

      it('should allow hover styles in a hover media query', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, '@media (hover: hover) { .button:hover { color: red; } }')).toEqual([])
      })

      it('should report hover styles in a custom media query not given', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, '@media (--screenHover) { .button:hover { color: red; } }')).toEqual([message])
      })

      it('should allow hover styles in a custom media query given', async () => {
        expect(await lint({
          'trigen/hover-in-media': [
            true,
            {
              customMedia: ['--screenHover', '--screenMouse']
            }
          ]
        }, '@media (--screenMouse) { .list { & .item:hover { color: red; } } }')).toEqual([])
      })

      it('should leave a selector without hover', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, '.button:focus-visible { color: red; }')).toEqual([])
      })

      it('should allow a hover that pins the look at rest', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, [
          '.item[aria-current], .item[aria-current]:is(:hover, :focus-visible, :active) { color: red; }',
          '.thumb::before, .thumb:hover::before { color: red; }'
        ].join('\n'))).toEqual([])
      })

      it('should report a hover beside another selector at rest', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, '.item, .other:is(:hover, :focus-visible) { color: red; }')).toEqual([message])
      })

      it('should report a hover the selector at rest cannot drop', async () => {
        expect(await lint({
          'trigen/hover-in-media': true
        }, '.item, .item:not(:hover) { color: red; }')).toEqual([message])
      })
    })

    describe('thin-scrollbar-in-media', () => {
      const message = 'Make a scrollbar thin for a mouse alone, in a pointer media query: a finger keeps the overlay one. (trigen/thin-scrollbar-in-media)'

      it('should report a thin scrollbar outside a media query', async () => {
        expect(await lint({
          'trigen/thin-scrollbar-in-media': true
        }, '.list { scrollbar-width: thin; }')).toEqual([message])
      })

      it('should allow a thin scrollbar in a pointer media query', async () => {
        expect(await lint({
          'trigen/thin-scrollbar-in-media': true
        }, '@media (pointer: fine) { .list { scrollbar-width: thin; } }')).toEqual([])
      })

      it('should allow a thin scrollbar in a custom media query given', async () => {
        expect(await lint({
          'trigen/thin-scrollbar-in-media': [
            true,
            {
              customMedia: '--screenMouse'
            }
          ]
        }, '@media (--screenMouse) { .list { scrollbar-width: thin; } }')).toEqual([])
      })

      it('should leave other scrollbar widths', async () => {
        expect(await lint({
          'trigen/thin-scrollbar-in-media': true
        }, '.list { scrollbar-width: none; }')).toEqual([])
      })
    })

    describe('no-root-margin', () => {
      const rules = {
        'trigen/no-root-margin': true
      }
      const message = 'A block does not set its own outer margin: where it stands is its consumer\'s. Only `0` and `auto` reset or center it. (trigen/no-root-margin)'

      it('should report a margin on the root', async () => {
        expect(await lint(rules, '.root { margin-block-end: var(--sizeSpace4); }')).toEqual([message])
      })

      it('should report a margin on the root in a state', async () => {
        expect(await lint(rules, '.root.open { margin: 4px 0; }')).toEqual([message])
      })

      it('should report a margin in a nested state of the root', async () => {
        expect(await lint(rules, '.root { &:not(.inline) { margin: -1px; } }')).toEqual([message])
      })

      it('should allow a reset and centering', async () => {
        expect(await lint(rules, '.root { margin: 0; } .root:modal { margin: auto 0 0; }')).toEqual([])
      })

      it('should leave an element inside the root', async () => {
        expect(await lint(rules, '.root .title { margin-block-end: var(--sizeSpace2); }')).toEqual([])
      })
    })

    describe('no-root-placement', () => {
      const rules = {
        'trigen/no-root-placement': true
      }
      const outOfFlow = 'A block does not take itself out of the flow: where it stands is its consumer\'s. Only `relative` and `static` keep it in its place. (trigen/no-root-placement)'
      const hidden = 'A block does not hide itself at a breakpoint: whether it shows there is its consumer\'s. (trigen/no-root-placement)'

      it('should report a root taken out of the flow', async () => {
        expect(await lint(rules, '.root { position: fixed; }')).toEqual([outOfFlow])
      })

      it('should report a root taken out of the flow in a nested state', async () => {
        expect(await lint(rules, '.root { &.stuck { position: sticky; } }')).toEqual([outOfFlow])
      })

      it('should allow a root that keeps its place', async () => {
        expect(await lint(rules, '.root { position: relative; } .root.flat { position: static; }')).toEqual([])
      })

      it('should leave the root\'s pseudo-elements and inner elements', async () => {
        expect(await lint(rules, '.root::before { position: absolute; } .root { &:active::after { position: absolute; } } .root .badge { position: absolute; }')).toEqual([])
      })

      it('should report a root that hides itself at a breakpoint', async () => {
        expect(await lint(rules, '@media (width < 600px) { .root { display: none; } }')).toEqual([hidden])
      })

      it('should report a root that hides itself in a nested query', async () => {
        expect(await lint(rules, '.root { display: flex; @container (width < 20rem) { display: none; } }')).toEqual([hidden])
      })

      it('should allow a root hidden by its own state, and an inner element hidden at a breakpoint', async () => {
        expect(await lint(rules, '.root[hidden] { display: none; } @media (width < 600px) { .root .label { display: none; } }')).toEqual([])
      })
    })

    describe('uikit-module-root', () => {
      const rules = {
        'trigen/uikit-module-root': true
      }
      const message = 'A kit component\'s module styles its root element as `.root`. (trigen/uikit-module-root)'

      it('should report a kit module without a root', async () => {
        expect(await lint(rules, '.button { color: red; }', '/app/uikit/Button/Button.module.css')).toEqual([message])
      })

      it('should allow a kit module with a root', async () => {
        expect(await lint(rules, '.root { color: red; }', '/app/uikit/Button/Button.module.css')).toEqual([])
      })

      it('should leave a block module', async () => {
        expect(await lint(rules, '.grid { gap: 0; }', '/app/blocks/Card/Card.module.css')).toEqual([])
      })

      it('should leave a module named apart from its folder', async () => {
        expect(await lint(rules, '.hideDark { display: none; }', '/app/uikit/mixins.module.css')).toEqual([])
      })
    })

    describe('no-bare-length', () => {
      const rules = {
        'trigen/no-bare-length': true
      }

      it('should report a length in a value', async () => {
        expect(await lint(rules, '.root { inline-size: 32px; }')).toEqual(['Expected a token or a calc of tokens for "32px": a value no scale owns is a custom property of the component. (trigen/no-bare-length)'])
      })

      it('should report a length in a calc', async () => {
        expect(await lint(rules, '.root { inline-size: calc(var(--sizeControlMd) - 2px); }')).toEqual(['Expected a token or a calc of tokens for "2px": a value no scale owns is a custom property of the component. (trigen/no-bare-length)'])
      })

      it('should report a time', async () => {
        expect(await lint(rules, '.root { transition-delay: 300ms; }')).toEqual(['Expected a token or a calc of tokens for "300ms": a value no scale owns is a custom property of the component. (trigen/no-bare-length)'])
      })

      it('should allow a custom property, a fallback, zero and proportions', async () => {
        expect(await lint(rules, '.root { --cardSizePicture: 24px; inline-size: var(--cardSizePicture, 24px); margin: 0; flex: 1 1 50%; block-size: 100dvh; grid-template-columns: 1fr 2fr; padding-block: 0.5lh; }')).toEqual([])
      })
    })
  })
})
