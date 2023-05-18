import type { Logger, ModuleNode, ViteDevServer } from 'vite'
import { createPageResolver } from './pages'
import { debug, resolvePath } from './utils'
import { MODULE_ID_VIRTUAL } from './constants'
import { resolveOptions } from './options'
import { setupWatcher } from './watcher'
import type {
  PageResolver,
  ResolvedOptions,
  RouteResolver,
  UserOptions,
} from './types'
import { createRouteResolver } from './routes'

/**
 * 创建上下文对象
 *
 * @example
 * ```
 * const ctx = new Context(config.root, userOptions)
 *
 * // 扫描页面目录
 * ctx.pages.scan()
 * ```
 */
export class Context {
  server?: ViteDevServer
  logger?: Logger

  root: string
  options: ResolvedOptions
  pages: PageResolver
  routes: RouteResolver

  constructor(viteRoot: string, userOptions: UserOptions) {
    this.root = viteRoot || resolvePath(process.cwd())
    this.options = resolveOptions(this.root, userOptions)
    this.pages = createPageResolver(this)
    this.routes = createRouteResolver(this)

    debug.options(this.options)
  }

  setLogger(logger: Logger) {
    this.logger = logger
  }

  setupViteServer(server: ViteDevServer) {
    this.server = server
    setupWatcher(this)
  }

  onUpdate() {
    if (!this.server)
      return null

    debug.hmr('reload generated pages')

    const { moduleGraph } = this.server
    const mods = moduleGraph.getModulesByFile(MODULE_ID_VIRTUAL)
    if (mods) {
      const seen = new Set<ModuleNode>()
      mods.forEach((mod) => {
        moduleGraph.invalidateModule(mod, seen)
      })
    }

    this.server.ws.send({
      type: 'full-reload',
    })
  }
}
