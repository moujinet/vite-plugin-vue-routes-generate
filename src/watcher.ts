import { resolvePath, slash } from './utils'
import type { Context } from './context'

function isPagesDir(path: string, ctx: Context) {
  for (const dir of ctx.options.dirs) {
    const dirPath = resolvePath(ctx.root, dir.src)
    if (path.startsWith(dirPath))
      return true
  }
  return false
}

function isTarget(path: string, ctx: Context) {
  return isPagesDir(slash(path), ctx)
    && (new RegExp(`\\.(${ctx.options.extensions.join('|')})$`)).test(slash(path))
}

export function setupWatcher(ctx: Context) {
  if (!ctx.server)
    return undefined

  const watcher = ctx.server.watcher

  watcher.on('add', async (path) => {
    if (!isTarget(path, ctx))
      return

    const pagePath = ctx.options.dirs.find(dir => path.startsWith(
      resolvePath(ctx.root, dir.src),
    ))!

    await ctx.pages.add(path, pagePath)
    ctx.onUpdate()
  })

  watcher.on('change', async (path) => {
    if (!isTarget(path, ctx))
      return

    const page = ctx.pages.get(path)
    if (page)
      await ctx.routes.checkUpdate(path)
  })

  watcher.on('unlink', async (path) => {
    if (!isTarget(path, ctx))
      return

    await ctx.pages.remove(path)
    ctx.onUpdate()
  })
}
