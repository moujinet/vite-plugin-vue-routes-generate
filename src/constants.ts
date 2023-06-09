export const ROUTES_IDS = [
  '~routes',
  // 'virtual:generated-routes',
]
export const ROUTES_META_IDS = [
  '~routes/meta',
  // 'virtual:generated-routes/meta',
]

export const MODULE_ID = 'vite-plugin-vue-routes-generate'
export const MODULE_ID_VIRTUAL = `/@${MODULE_ID}/generated-routes`
export const ROUTE_BLOCK_ID_VIRTUAL = `/@${MODULE_ID}/route-block`

export const ROUTE_BLOCK_RE = /\?vue&type=route/
export const DYNAMIC_ROUTE_RE = /\[{1,2}(\.{3}\w+|\w+)\]{1,2}|(\+)/g
