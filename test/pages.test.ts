import { describe, expect, it } from 'vitest'
import { context } from './fixtures/context'

describe('pages', () => {
  it('scan pages', async () => {
    await context.pages.scan()
    const pages = context.pages.toArray()

    expect(pages).toMatchInlineSnapshot(`
      [
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/layouts/default.vue",
          "path": "/default",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[...all].vue",
          "path": "/[...all]",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[[bar]]+.vue",
          "path": "/[[bar]]+",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[[foo]].vue",
          "path": "/[[foo]]",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[name].vue",
          "path": "/[name]",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[tar]+.vue",
          "path": "/[tar]+",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/index.vue",
          "path": "/index",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[name]/index.vue",
          "path": "/[name]/index",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/[name]/settings.vue",
          "path": "/[name]/settings",
        },
      ]
    `)
  })
})
