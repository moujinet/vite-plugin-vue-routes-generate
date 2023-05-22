import type { PageRoute, PageRouteMeta, ResolvedOptions } from './types'

function stringifyRoutes(routes: PageRoute[], options: ResolvedOptions) {
  const importMap = new Map<string, string>()

  function getImportCode(path: string, importName: string) {
    return options.importMode === 'async'
      ? `const ${importName} = () => import('${path}')`
      : `import ${importName} from '${path}'`
  }

  function filterRoutes(routes: PageRoute[], isLayout: boolean) {
    return routes.filter((route) => {
      if (route.isLayout !== isLayout)
        return false

      delete route.isLayout

      if (route.children)
        route.children = filterRoutes(route.children, isLayout)

      let importName = importMap.get(route.component)
      if (!importName) {
        importName = `__import_page_${importMap.size}__`
        importMap.set(route.component, importName)
      }

      route.component = `${importName}`

      return true
    })
  }

  function getFinalRoutes(pages: PageRoute[], layouts: PageRoute[]) {
    return pages.map((page) => {
      if (page.meta?.layout || options.defaultLayout) {
        const layout = layouts.find((layout) => {
          return layout.name === (page.meta?.layout || options.defaultLayout)
        })

        if (layout) {
          return {
            path: page.path,
            component: layout.component,
            children: page.path === '/' ? [page] : [{ ...page, path: '' }],
          }
        }
      }

      return page
    })
  }

  const layouts = filterRoutes(routes, true) || []
  const pages = filterRoutes(routes, false)
  const finalRoutes = getFinalRoutes(pages, layouts)
  const imports = Array.from(importMap).map(args => getImportCode(...args))

  return {
    imports,
    routes: JSON.stringify(finalRoutes)
      .replace(/\"__import_page_(\d+)__\"/g, '__import_page_$1__'),
  }
}

export function generateClientCode(_routes: PageRoute[], options: ResolvedOptions) {
  const { imports, routes } = stringifyRoutes(_routes, options)
  return `${imports.join(';\n')}\n\nconst routes = ${routes};\n\nexport default routes;`
}

export function generateClientRouteMeta(routesMap: PageRouteMeta[]) {
  return `const routesMap = ${JSON.stringify(routesMap)};\n\nexport default routesMap;`
}
