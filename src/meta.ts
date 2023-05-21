import type { Context } from './context'
import type { PageRouteMeta } from './types'
import { normalizeCase, normalizeName, normalizePath } from './utils'

export async function resolveRoutesMeta(ctx: Context) {
  const routesMeta: PageRouteMeta[] = []
  const pages = ctx.pages.toArray()

  pages.forEach((page) => {
    const customBlock = ctx.routes.customBlock.get(page.file)

    if (customBlock?.layout)
      return null

    const meta: PageRouteMeta = {
      name: (customBlock?.name || normalizeName(page.path)) as string,
      path: normalizePath(normalizeCase(page.path, ctx.options.caseSensitive)),
      file: page.file.replace(ctx.root, ''),
      ...customBlock?.meta,
    }

    routesMeta.push(meta)
  })

  return routesMeta
}
