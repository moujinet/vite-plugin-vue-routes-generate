import { describe, expect, it } from 'vitest'
import { context } from './fixtures/context'

describe('pages', () => {
  it('scan pages', async () => {
    await context.pages.scan()
    const pages = context.pages.toArray()

    expect(pages).toMatchInlineSnapshot(`
      [
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/pages/index.vue",
          "path": "/",
        },
        {
          "file": "/Users/xinxuan/workspace/myspace/@mouji/vite-plugin-route-generate/playground/src/layouts/default.vue",
          "path": "/default",
        },
      ]
    `)
  })
})
