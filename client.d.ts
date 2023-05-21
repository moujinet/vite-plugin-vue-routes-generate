declare module '~routes' {
  import type { RouteRecordRaw } from 'vue-router'
  const routes: RouteRecordRaw[]
  export default routes
}

declare module '~routes/meta' {
  import type { PageRouteMeta } from 'vite-plugin-vue-routes-generate'
  const routesMeta: PageRouteMeta[]
  export default routesMeta
}
