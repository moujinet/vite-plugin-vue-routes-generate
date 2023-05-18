import type { Context } from './context'
import type { RouteResolver } from './types'
import { createCustomBlockParser } from './customBlock'

export function createRouteResolver(ctx: Context): RouteResolver {
  const customBlock = createCustomBlockParser(ctx)

  async function checkUpdate(path: string) {
    customBlock.checkUpdate(path)
  }

  async function injectCode() {
    return ''
  }

  return {
    customBlock,
    checkUpdate,
    injectCode,
  }
}
