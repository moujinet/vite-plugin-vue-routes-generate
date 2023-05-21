import { DYNAMIC_ROUTE_RE } from './constants'
import type { Context } from './context'
import type { PageRoute, RouteResolver } from './types'
import { createCustomBlockParser } from './customBlock'
import { normalizeCase, normalizeName, normalizePath } from './utils'
import { generateClientCode, generateClientRouteMeta } from './clientCode'
import { resolveRoutesMeta } from './meta'

export function createRouteResolver(ctx: Context): RouteResolver {
  const customBlockParser = createCustomBlockParser(ctx)

  function prepareRoutes(routes: PageRoute[], parent?: PageRoute): PageRoute[] {
    for (const route of routes) {
      if (parent) {
        route.path = route.path
          .replace(parent.path, '')
          .replace(/^\//, '')
      }

      if (route.children)
        route.children = prepareRoutes(route.children, route)

      delete route.rawPath
    }

    return routes
  }

  async function resolveRoutes() {
    const routes: PageRoute[] = []
    const pages = ctx.pages.toArray()

    pages.forEach((page) => {
      const pathParts = page.path.split('/')

      const customBlock = ctx.routes.customBlock.get(page.file)
      const isLayout = customBlock?.layout === true
      const isDynamicRoute = DYNAMIC_ROUTE_RE.test(page.path)

      const name = customBlock?.name || normalizeName(page.path)
      const component = page.file.replace(ctx.root, '')
      const path = normalizePath(normalizeCase(page.path, ctx.options.caseSensitive))
      const meta = customBlock?.meta
        ? { layout: ctx.options.defaultLayout, ...customBlock.meta }
        : { layout: ctx.options.defaultLayout }

      const route: PageRoute = {
        name,
        path,
        rawPath: page.path,
        component,
        isLayout,
        props: true,
        meta: isLayout
          ? customBlock?.meta
            ? { ...customBlock.meta }
            : {}
          : meta,
      }

      let parentRoutes = routes

      for (let i = 0; i < pathParts.length; i++) {
        const parent = parentRoutes.find((parent) => {
          return pathParts.slice(0, i + 1).join('/') === parent.rawPath
        })

        if (parent) {
          parent.children = parent.children || []
          parentRoutes = parent.children
        }
      }

      if (isDynamicRoute)
        parentRoutes.push(route)
      else
        parentRoutes.unshift(route)
    })

    return prepareRoutes(routes)
  }

  async function checkUpdate(path: string) {
    await customBlockParser.checkUpdate(path)
  }

  async function getClientCode() {
    const routes = await resolveRoutes()
    const client = generateClientCode(routes, ctx.options)
    return client
  }

  async function getRoutesMeta() {
    const routesMeta = await resolveRoutesMeta(ctx)
    const client = generateClientRouteMeta(routesMeta)
    return client
  }

  return {
    customBlock: customBlockParser,
    resolveRoutes,
    checkUpdate,
    getClientCode,
    getRoutesMeta,
  }
}
