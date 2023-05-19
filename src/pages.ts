import fg from 'fast-glob'
import type {
  PageInfo,
  PageResolver,
  ScanDirOption,
} from './types'
import {
  countSlash,
  debug,
  globToRegex,
  joinPath,
  resolvePath,
} from './utils'
import type { Context } from './context'

export function createPageResolver(ctx: Context): PageResolver {
  const pages = new Map<string, PageInfo>()

  function asPageInfo(file: string, dir: ScanDirOption): PageInfo {
    const RE = globToRegex(joinPath(dir.src, dir.filePattern).replace(ctx.root, ''))
    const matched = file.replace(ctx.root, '').match(RE) || []
    const path = joinPath(dir.prefix || '', ...matched)

    return { file, path }
  }

  /**
   * 添加页面
   *
   * @param path 页面路径
   * @param dir 路径配置
   */
  async function add(path: string, dir: ScanDirOption) {
    debug.pages('add', path.replace(ctx.root, ''))
    pages.set(path, asPageInfo(path, dir))
    await ctx.routes.checkUpdate(path)
  }

  /**
   * 删除页面
   *
   * @param path 页面路径
   */
  async function remove(path: string) {
    debug.pages('remove', path.replace(ctx.root, ''))
    pages.delete(path)
    await ctx.routes.customBlock.remove(path)
  }

  /**
   * 执行扫描
   */
  async function scan() {
    const { dirs, exclude } = ctx.options

    await Promise.all(
      dirs.map((dir) => {
        debug.scan(dir)

        return fg(dir.filePattern, {
          cwd: dir.src,
          onlyFiles: true,
          ignore: exclude,
        })
          .then(files => files.map(path => resolvePath(dir.src, path)))
          .then(files => Promise.all(
            files.map(path => add(path, dir)),
          ))
      }),
    )
  }

  return {
    add,
    remove,
    scan,
    get: (path: string) => {
      return pages.get(path)
    },
    toArray: () => {
      return [...pages.values()]
        .sort((a, b) => countSlash(a.path) - countSlash(b.path))
    },
  }
}
