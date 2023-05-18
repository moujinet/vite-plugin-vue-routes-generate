export const MODULE_IDS = [
  '~routes',
  'virtual:generated-routes',
]

export const MODULE_ID = 'vite-plugin-vue-routes-generate'
export const MODULE_ID_VIRTUAL = `/@${MODULE_ID}/generated-routes`
export const ROUTE_BLOCK_ID_VIRTUAL = `/@${MODULE_ID}/route-block`

export const ROUTE_BLOCK_RE = /\?vue&type=route/
