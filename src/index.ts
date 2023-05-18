import type { Plugin } from 'vite'
import type { UserOptions } from './types'
import { Context } from './context'
import {
  MODULE_ID,
  MODULE_IDS,
  MODULE_ID_VIRTUAL,
  ROUTE_BLOCK_ID_VIRTUAL,
  ROUTE_BLOCK_RE,
} from './constants'
import { parsePageRequest } from './utils'

function VueRoutesGeneratePlugin(userOptions: UserOptions = {}): Plugin {
  let ctx: Context

  return {
    name: MODULE_ID,
    enforce: 'pre',

    async configResolved(config) {
      ctx = new Context(config.root, userOptions)
      ctx.setLogger(config.logger)
      await ctx.pages.scan()
    },

    configureServer(server) {
      ctx.setupViteServer(server)
    },

    resolveId(id) {
      if (MODULE_IDS.includes(id))
        return `${MODULE_ID_VIRTUAL}?id=${id}`

      if (ROUTE_BLOCK_RE.test(id))
        return ROUTE_BLOCK_ID_VIRTUAL

      return null
    },

    async load(id) {
      const {
        moduleId,
        pageId,
      } = parsePageRequest(id)

      if (moduleId === MODULE_ID_VIRTUAL && pageId && MODULE_IDS.includes(pageId)) {
        return {
          code: '',
          map: null,
        }
      }

      if (id === ROUTE_BLOCK_ID_VIRTUAL) {
        return {
          code: 'export default {};',
          map: null,
        }
      }

      return null
    },
  }
}

export * from './types'

export default VueRoutesGeneratePlugin
