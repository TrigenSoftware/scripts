import { describe, it, expect } from 'vitest'
import { parseFilesList, parseSourcesList } from './parse.js'

describe('project-files', () => {
  describe('parse', () => {
    describe('parseFilesList', () => {
      it('should parse correctly', async () => {
        const filesList = await parseFilesList(`# Type A
dir/file1.txt
dir/file2.txt
# Type B
file3.txt
# Type C
file4.txt
`)

        expect(filesList).toEqual([
          {
            type: 'Type A',
            path: 'dir/file1.txt'
          },
          {
            type: 'Type A',
            path: 'dir/file2.txt'
          },
          {
            type: 'Type B',
            path: 'file3.txt'
          },
          {
            type: 'Type C',
            path: 'file4.txt'
          }
        ])
      })
    })

    describe('parseSourcesList', () => {
      it('should parse correctly', async () => {
        const filesList = await parseSourcesList(`owner1/repo1
owner2/repo2
`)

        expect(filesList).toEqual([
          {
            owner: 'owner1',
            repo: 'repo1'
          },
          {
            owner: 'owner2',
            repo: 'repo2'
          }
        ])
      })
    })
  })
})
