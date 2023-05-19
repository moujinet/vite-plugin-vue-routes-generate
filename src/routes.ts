import { DYNAMIC_ROUTE_RE } from './constants'
import type { Context } from './context'
import type { PageRoute, RouteResolver } from './types'
import { createCustomBlockParser } from './customBlock'
import { parseRoutePath, trimSlash } from './utils'
import { generateClientCode } from './clientCode'

export function createRouteResolver(ctx: Context): RouteResolver {
  const customBlockParser = createCustomBlockParser(ctx)

  function normalizeName(path: string) {
    return trimSlash(
      path.replace(DYNAMIC_ROUTE_RE, '$1'),
      'left',
    )
      .replace(/^\.{3}/, '')
      .replace(/\//g, '.')
  }

  function normalizeCase(name: string, caseSensitive: boolean) {
    return caseSensitive ? name : name.toLocaleLowerCase()
  }

  function normalizePath(path: string) {
    return normalizeCase(parseRoutePath(path), ctx.options.caseSensitive)
  }

  function normalizeComponent(path: string) {
    return path
  }

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

      const name = normalizeName(page.path)
      const component = normalizeComponent(page.file)
      const path = normalizePath(page.path)
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

  async function injectCode() {
    const routes = await resolveRoutes()
    const client = generateClientCode(routes, ctx.options)

    return client
  }

  return {
    customBlock: customBlockParser,
    resolveRoutes,
    checkUpdate,
    injectCode,
  }
}
