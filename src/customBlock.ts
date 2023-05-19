import { readFileSync } from 'node:fs'
import colors from 'picocolors'
import deepEqual from 'deep-equal'
import { importModule } from 'local-pkg'
import { parse as YAMLParser } from 'yaml'
import JSON5 from 'json5'
import type { SFCBlock, SFCDescriptor } from '@vue/compiler-sfc'
import type { CustomBlock, CustomBlockParser } from './types'
import type { Context } from './context'
import { MODULE_ID } from './constants'
import { debug } from './utils'

async function parseSFC(code: string): Promise<SFCDescriptor> {
  try {
    const { parse } = await importModule('@vue/compiler-sfc') as typeof import('@vue/compiler-sfc')
    return parse(code, {
      pad: 'space',
    }).descriptor
    || (parse as any)({
      source: code,
    })
  }
  catch {
    throw new Error(`[${MODULE_ID}] Vue3's "@vue/compiler-sfc" is required.`)
  }
}

function parseRouteBlock(block: SFCBlock, path: string, ctx: Context) {
  const lang = block.lang || ctx.options.routeBlockLang

  debug.routeBlock(`${colors.blue(lang.toUpperCase())} parser -> ${path.replace(ctx.root, '')}`)

  if (lang === 'json5') {
    try {
      return JSON5.parse(block.content)
    }
    catch (e: any) {
      throw new Error(`Invalid JSON5 format of <${block.type}> content in ${path}\n${e.message}`)
    }
  }
  else if (lang === 'json') {
    try {
      return JSON.parse(block.content)
    }
    catch (e: any) {
      throw new Error(`Invalid JSON format of <${block.type}> content in ${path}\n${e.message}`)
    }
  }
  else if (lang === 'yaml' || lang === 'yml') {
    try {
      return YAMLParser(block.content)
    }
    catch (err: any) {
      throw new Error(`Invalid YAML format of <${block.type}> content in ${path}\n${err.message}`)
    }
  }
}

async function getRouteBlock(path: string, ctx: Context) {
  const content = readFileSync(path, 'utf-8')
  const parsedSFC = await parseSFC(content)
  const blockStr = parsedSFC?.customBlocks.find(b => b.type === 'route')

  if (!blockStr)
    return null

  return parseRouteBlock(blockStr, path, ctx) as CustomBlock
}

export function createCustomBlockParser(ctx: Context): CustomBlockParser {
  const customBlockMap = new Map<string, CustomBlock>()

  return {
    get: (path: string) => {
      return customBlockMap.get(path)
    },
    remove: async (path: string) => {
      customBlockMap.delete(path)
    },
    checkUpdate: async (path: string) => {
      const exitsCustomBlock = customBlockMap.get(path)
      let customBlock: CustomBlock | null

      try {
        customBlock = await getRouteBlock(path, ctx)
      }
      catch (error: any) {
        ctx.logger?.error(colors.red(`[${MODULE_ID}] ${error.message}`))
        return
      }

      if (!exitsCustomBlock && !customBlock)
        return

      if (!customBlock) {
        customBlockMap.delete(path)
        debug.routeBlock('%s deleted', path.replace(ctx.root, ''))
        return
      }

      if (!exitsCustomBlock || !deepEqual(exitsCustomBlock, customBlock)) {
        debug.routeBlock('%s %O -> %O', path.replace(ctx.root, ''), exitsCustomBlock, customBlock)
        customBlockMap.set(path, customBlock)
        ctx.onUpdate()
      }
    },
  }
}
