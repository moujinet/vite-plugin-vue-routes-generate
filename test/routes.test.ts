import { describe, expect, it } from 'vitest'
import { context } from './fixtures/context'

describe('routes', () => {
  it('resolve routes', async () => {
    await context.pages.scan()
    expect(await context.routes.resolveRoutes()).toMatchInlineSnapshot(`
      [
        {
          "component": "src/pages/index.vue",
          "isLayout": false,
          "meta": {
            "layout": "default",
          },
          "name": "index",
          "path": "/",
        },
        {
          "component": "src/layouts/default.vue",
          "isLayout": true,
          "meta": {},
          "name": "default",
          "path": "/default",
        },
        {
          "component": "src/pages/[...all].vue",
          "isLayout": false,
          "meta": {
            "layout": "default",
          },
          "name": "all",
          "path": "/:all(.*)*",
        },
        {
          "component": "src/pages/[[bar]]+.vue",
          "isLayout": false,
          "meta": {
            "layout": "default",
          },
          "name": "bar",
          "path": "/:bar*",
        },
        {
          "component": "src/pages/[[foo]].vue",
          "isLayout": false,
          "meta": {
            "layout": "default",
          },
          "name": "foo",
          "path": "/:foo?",
        },
        {
          "children": [
            {
              "component": "src/pages/[name]/index.vue",
              "isLayout": false,
              "meta": {
                "layout": "default",
              },
              "name": "name.index",
              "path": "",
            },
            {
              "component": "src/pages/[name]/settings.vue",
              "isLayout": false,
              "meta": {
                "layout": false,
              },
              "name": "name.settings",
              "path": "settings",
            },
          ],
          "component": "src/pages/[name].vue",
          "isLayout": false,
          "meta": {
            "layout": "default",
          },
          "name": "name",
          "path": "/:name",
        },
        {
          "component": "src/pages/[tar]+.vue",
          "isLayout": false,
          "meta": {
            "layout": "default",
          },
          "name": "tar",
          "path": "/:tar+",
        },
      ]
    `)
  })

  it('inject code', async () => {
    await context.pages.scan()
    expect(await context.routes.injectCode()).toMatchInlineSnapshot(`
      "const __import_page_0__ = () => import('src/layouts/default.vue');
      const __import_page_1__ = () => import('src/pages/index.vue');
      const __import_page_2__ = () => import('src/pages/[...all].vue');
      const __import_page_3__ = () => import('src/pages/[[bar]]+.vue');
      const __import_page_4__ = () => import('src/pages/[[foo]].vue');
      const __import_page_5__ = () => import('src/pages/[name]/index.vue');
      const __import_page_6__ = () => import('src/pages/[name]/settings.vue');
      const __import_page_7__ = () => import('src/pages/[name].vue');
      const __import_page_8__ = () => import('src/pages/[tar]+.vue')

      const routes = [{\\"name\\":\\"default\\",\\"path\\":\\"/default\\",\\"component\\":__import_page_0__,\\"meta\\":{},\\"children\\":[{\\"name\\":\\"index\\",\\"path\\":\\"/\\",\\"component\\":__import_page_1__,\\"meta\\":{\\"layout\\":\\"default\\"}},{\\"name\\":\\"all\\",\\"path\\":\\"/:all(.*)*\\",\\"component\\":__import_page_2__,\\"meta\\":{\\"layout\\":\\"default\\"}},{\\"name\\":\\"bar\\",\\"path\\":\\"/:bar*\\",\\"component\\":__import_page_3__,\\"meta\\":{\\"layout\\":\\"default\\"}},{\\"name\\":\\"foo\\",\\"path\\":\\"/:foo?\\",\\"component\\":__import_page_4__,\\"meta\\":{\\"layout\\":\\"default\\"}},{\\"name\\":\\"name\\",\\"path\\":\\"/:name\\",\\"component\\":__import_page_7__,\\"meta\\":{\\"layout\\":\\"default\\"},\\"children\\":[{\\"name\\":\\"name.index\\",\\"path\\":\\"\\",\\"component\\":__import_page_5__,\\"meta\\":{\\"layout\\":\\"default\\"}},{\\"name\\":\\"name.settings\\",\\"path\\":\\"settings\\",\\"component\\":__import_page_6__,\\"meta\\":{\\"layout\\":false}}]},{\\"name\\":\\"tar\\",\\"path\\":\\"/:tar+\\",\\"component\\":__import_page_8__,\\"meta\\":{\\"layout\\":\\"default\\"}}]}];

      export default routes;"
    `)
  })
})
