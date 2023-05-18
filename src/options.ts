import type { Options, ResolvedOptions, UserOptions } from './types'
import { extsToGlob, isArray, resolvePath, trimSlash } from './utils'

function normalizeDirs(
  root: string,
  dirs: Options['dirs'],
  extensions: Options['extensions'],
) {
  const exts = extsToGlob(extensions)

  return (
    isArray(dirs) ? dirs : [dirs]
  ).map(
    path => typeof path === 'string'
      ? { src: path }
      : path,
  ).map(path => ({
    src: resolvePath(root, path.src),
    prefix: path.prefix ? trimSlash(path.prefix) : '',
    filePattern: path.filePattern ?? `**/*.${exts}`,
  }))
}

export function resolveOptions(root: string, userOptions: UserOptions): ResolvedOptions {
  const {
    defaultLayout = false,
    dirs = 'src/pages',
    extensions = ['vue'],
    exclude = ['node_modules', '.git', '**\/__*__\/**'],
    caseSensitive = false,
    routeBlockLang = 'json5',
    importMode = 'async',
  } = userOptions

  const exts = extensions
    .map((ext) => {
      if (ext.startsWith('.'))
        // 删除扩展前的 `.`, ['.vue'] -> ['vue']
        return ext.replace(/^\./, '')
      return ext
    })
    .sort(
      // 根据扩展名字符长度排序，['vue', 'page.vue'] -> ['page.vue', 'vue']
      (a, b) => b.length - a.length,
    )

  const normalized = normalizeDirs(root, dirs, exts)

  return {
    defaultLayout,
    dirs: normalized,
    extensions: exts,
    exclude,
    caseSensitive,
    routeBlockLang,
    importMode,
  }
}
