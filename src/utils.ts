import { resolve } from 'node:path'
import Debug from 'debug'
import { MODULE_ID } from './constants'

const LEADING_SLASH_RE = /^\//
const TRAILING_SLASH_RE = /\/$/

export const debug = {
  options: Debug(`${MODULE_ID}:options`),
  scan: Debug(`${MODULE_ID}:scan`),
  pages: Debug(`${MODULE_ID}:pages`),
  routeBlock: Debug(`${MODULE_ID}:routeBlock`),
  hmr: Debug(`${MODULE_ID}:hmr`),
}

export const isArray: (arg: ArrayLike<any> | any) => arg is ReadonlyArray<any>
  = Array.isArray

export function slash(path: string) {
  return path.replace(/\\/g, '/')
}

export function trimSlash(
  path: string,
  mode: '' | 'left' | 'right' = '',
  skipSingle = false,
): string {
  const replaceIn = (...modes: string[]) => {
    return modes.includes(mode)
    && path.length > (skipSingle ? 1 : 0)
      ? ''
      : '/'
  }

  return slash(path)
    .replace(LEADING_SLASH_RE, replaceIn('', 'left'))
    .replace(TRAILING_SLASH_RE, replaceIn('', 'right'))
}

export function countSlash(path: string) {
  return (path.match(/\//g) || []).length
}

export function resolvePath(...paths: string[]): string {
  return slash(resolve(...paths))
}

export function extsToGlob(extensions: string[]): string {
  return extensions.length > 1
    ? `{${extensions.join(',')}}`
    : extensions[0] || ''
}

export function joinPath(...paths: string[]): string {
  let result = ''
  for (const path of paths) {
    result
      = result.replace(TRAILING_SLASH_RE, '')
      + (path && `/${path.replace(LEADING_SLASH_RE, '')}`)
  }
  return slash(result)
}

export function globToRegex(glob: string) {
  if (!glob || typeof glob !== 'string')
    throw new Error('Invalid input')

  const [dir, ext] = glob.includes('**/*.') ? glob.split('**/*.') : glob.split('*.')
  const dirs = dir.split('**')

  function withNestDirs(dirs: string[]) {
    return dirs
      .map(
        (d, i) => i === 0 ? `(?<=${d})` : `(?=${d})`,
      )
      .join('\\S+')
  }

  function withFileName(dirs: string[]) {
    return dirs.length === 2 ? `|(?<=${dirs[1]})\\S+` : '\\S+'
  }

  function withExtensions(ext: string) {
    const extensions = ext
      .replace(/\{(\S+)\}/, '($1)')
      .replace(/\,/g, '|')
      .replace(/\./g, '\\.') // page.vue -> page\.vue

    return `(?=\\.${extensions === '*' ? '' : extensions})`
  }

  return RegExp(`${withNestDirs(dirs)}${withFileName(dirs)}${withExtensions(ext)}`, 'g')
}

export function normalizeCase(name: string, caseSensitive: boolean) {
  return caseSensitive ? name : name.toLocaleLowerCase()
}

export function replaceWithRegex(pattern: RegExp, str: string, replace: string) {
  if (pattern.test(str))
    return str.replace(pattern, replace)
  return str
}

export function parseRoutePath(routePath: string) {
  let path = routePath

  // /[...name] -> /:name(.*)*
  path = replaceWithRegex(/\[\.{3}(\w+)\]/, path, ':$1(.*)*')
  // /[[name]]+ -> /:name*
  path = replaceWithRegex(/\[{2,}(\w+)\]{2,}\+/, path, ':$1*')
  // /[[name]] -> /:name?
  path = replaceWithRegex(/\[{2,}(\w+)\]{2,}/, path, ':$1?')
  // /[name] -> /:name
  path = replaceWithRegex(/\[{1,}(\w+)\]{1,}/g, path, ':$1')
  // /index -> /
  path = path.replace(/\/index$/, '/')

  return trimSlash(path, 'right', true)
}

export function parsePageRequest(id: string) {
  const [moduleId, rawQuery] = id.split('?', 2)
  const query = new URLSearchParams(rawQuery)
  const pageId = query.get('id')

  return {
    moduleId,
    query,
    pageId,
  }
}
