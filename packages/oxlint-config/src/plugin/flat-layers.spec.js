import {
  describe,
  it,
  expect,
  beforeAll
} from 'vitest'
import { lint } from './ruleTester.mock.js'

const rules = {
  'trigen/flat-layers': 'error'
}
// An app laid out in layers, its alias set by the tsconfig alone
const app = {
  'tsconfig.json': JSON.stringify({
    compilerOptions: {
      paths: {
        '~/*': ['./app/*']
      }
    }
  }),
  'app/assets/logo/index.ts': "export default 'logo.svg'\n",
  'app/shared/constants.ts': 'export const SECOND = 1000\n',
  'app/services/garden/index.ts': "export * from './garden'\n",
  'app/services/garden/garden.ts': 'export interface Garden {\n  id: string\n}\n\nexport const garden = 1\n',
  'app/stores/plant.list.ts': "import { base } from './plant'\n\nexport const list = base\n",
  'app/uikit/Button/index.ts': "export * from './Button'\n",
  'app/uikit/Button/Button.tsx': 'export function Button() {\n  return null\n}\n',
  'app/uikit/Button/skeleton.tsx': 'export function ButtonSkeleton() {\n  return null\n}\n',
  'app/uikit/shared/modal.ts': 'export const MODAL = 1\n',
  'app/uikit/hooks.ts': 'export function useBlink() {}\n',
  'app/blocks/Card/index.ts': "export * from './Card'\n",
  'app/blocks/Card/Card.tsx': 'export function useCard() {}\n\nexport function Card() {\n  return null\n}\n',
  'app/blocks/shared/hooks.ts': 'export function useGarden() {}\n',
  'app/blocks/shared/hooks/post.ts': 'export const usePost = () => null\n'
}

describe('oxlint-config', () => {
  describe('plugin', () => {
    describe('flat-layers', () => {
      let messages

      beforeAll(async () => {
        messages = await lint(rules, {
          ...app,
          'app/stores/plant.ts': "import { list } from './plant.list'\n\nexport const base = 1\nexport const all = list\n",
          'app/uikit/Upward/Upward.tsx': "import { base } from '~/stores/plant'\n\nexport const value = base\n",
          'app/uikit/Typed/Typed.tsx': "import type { Garden } from '~/services/garden'\n\nexport type Value = Garden\n",
          'app/uikit/Valued/Valued.tsx': "import { garden } from '~/services/garden'\n\nexport const value = garden\n",
          'app/uikit/Leaky/index.ts': "export * from './skeleton'\n",
          'app/uikit/Leaky/skeleton.tsx': 'export function LeakySkeleton() {\n  return null\n}\n',
          'app/blocks/Relative/Relative.tsx': "import { Button } from '../../uikit/Button'\n\nexport const value = Button\n",
          'app/blocks/Aliased/Aliased.tsx': "import { Card } from '~/blocks/Card'\n\nexport const value = Card\n",
          'app/blocks/Deep/Deep.tsx': "import { Button } from '~/uikit/Button/Button'\n\nexport const value = Button\n",
          'app/blocks/Entry/Entry.tsx': "import { ButtonSkeleton } from '~/uikit/Button/skeleton'\nimport { Button } from '~/uikit/Button'\n\nexport const value = [ButtonSkeleton, Button]\n",
          'app/blocks/Kit/Kit.tsx': "import { MODAL } from '~/uikit/shared/modal'\n\nexport const value = MODAL\n",
          'app/blocks/Picture/Picture.tsx': "import logo from '~/assets/logo'\n\nexport const value = logo\n",
          'app/stores/picture.ts': "import logo from '~/assets/logo'\n\nexport const value = logo\n",
          'app/blocks/shared/garden.ts': 'export function useGardenName() {}\n',
          'app/pages/Home/Home.tsx': "import logo from '~/assets/logo'\nimport { SECOND } from '~/shared/constants'\nimport { garden } from '~/services/garden'\nimport { base } from '~/stores/plant'\nimport { Button } from '~/uikit/Button'\nimport { Card } from '~/blocks/Card'\n\nexport const value = [logo, SECOND, garden, base, Button, Card]\n",
          'app/index.tsx': "export const pages = () => import('./pages/Home/Home')\n",
          'app/uikit/Button/Button.stories.tsx': "const meta = {\n  title: 'UIKit/Button'\n} satisfies object\n\nexport default meta\n",
          'app/blocks/Card/Card.stories.tsx': "export default {\n  title: 'UIKit/Card'\n}\n",
          'app/pages/Home/Home.stories.tsx': "export default {\n  title: 'Pages/Home/Signed in'\n}\n",
          'app/uikit/typography.stories.tsx': "export default {\n  title: 'UIKit/typography'\n}\n"
        })
      })

      it('should report an import against the layers\' direction', () => {
        expect(messages['app/uikit/Upward/Upward.tsx']).toEqual(['uikit does not import from stores.'])
      })

      it('should allow a type import the layer may take', () => {
        expect(messages['app/uikit/Typed/Typed.tsx']).toEqual([])
      })

      it('should report a value import where the layer takes only types', () => {
        expect(messages['app/uikit/Valued/Valued.tsx']).toEqual(['uikit imports only types from services.'])
      })

      it('should report a relative import from another layer', () => {
        expect(messages['app/blocks/Relative/Relative.tsx']).toEqual(['Import from another layer by its alias, not by a relative path.'])
      })

      it('should report an aliased import from the same layer', () => {
        expect(messages['app/blocks/Aliased/Aliased.tsx']).toEqual(['Import from the same layer by a relative path.'])
      })

      it('should report a deep import into another module', () => {
        expect(messages['app/blocks/Deep/Deep.tsx']).toEqual(['Import from Button through its index: only entry points such as its skeleton or loadable are imported by their path.'])
      })

      it('should allow an entry point by its path and a module through its index', () => {
        expect(messages['app/blocks/Entry/Entry.tsx']).toEqual([])
      })

      it('should report an index that re-exports an entry point', () => {
        expect(messages['app/uikit/Leaky/index.ts']).toEqual(['An index does not re-export an entry point imported by its path, such as a skeleton, a loadable or a mock.'])
      })

      it('should report a store base that imports its subdomain', () => {
        expect(messages['app/stores/plant.ts']).toEqual(['A store base imports none of its subdomains.'])
      })

      it('should allow a subdomain that imports its base', () => {
        expect(messages['app/stores/plant.list.ts']).toEqual([])
      })

      it('should report the kit\'s shared code imported from another layer', () => {
        expect(messages['app/blocks/Kit/Kit.tsx']).toEqual(['uikit/shared is the kit\'s own: only uikit imports it.'])
      })

      it('should allow assets in a block', () => {
        expect(messages['app/blocks/Picture/Picture.tsx']).toEqual([])
      })

      it('should report a layer that does not take assets', () => {
        expect(messages['app/stores/picture.ts']).toEqual(['stores does not import from assets.'])
      })

      it('should let pages import from every layer', () => {
        expect(messages['app/pages/Home/Home.tsx']).toEqual([])
      })

      it('should leave the files outside the layers', () => {
        expect(messages['app/index.tsx']).toEqual([])
      })

      it('should allow a story titled by its layer and its folder', () => {
        expect([
          messages['app/uikit/Button/Button.stories.tsx'],
          messages['app/pages/Home/Home.stories.tsx'],
          messages['app/uikit/typography.stories.tsx']
        ]).toEqual([
          [],
          [],
          []
        ])
      })

      it('should report a story titled by another layer', () => {
        expect(messages['app/blocks/Card/Card.stories.tsx']).toEqual(['A story\'s title starts with its layer and its folder: "Blocks/Card".'])
      })

      it('should report a hook declared outside the files of hooks', () => {
        expect(messages['app/blocks/shared/garden.ts']).toEqual(['Declare a hook in a .jsx or .tsx file, a hooks file or a hooks folder, where the rules of hooks find it.'])
      })

      it('should allow hooks in a component file, a hooks file and a hooks folder', () => {
        expect([
          messages['app/blocks/Card/Card.tsx'],
          messages['app/uikit/hooks.ts'],
          messages['app/blocks/shared/hooks.ts'],
          messages['app/blocks/shared/hooks/post.ts']
        ]).toEqual([
          [],
          [],
          [],
          []
        ])
      })
    })
  })
})
