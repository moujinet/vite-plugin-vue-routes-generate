import { resolve } from 'node:path'
import { Context } from '../../src/context'
import type { UserOptions } from '../../src/types'

export const root = resolve('./playground')

export const userOptions: UserOptions = {
  dirs: [
    'src/pages',
    'src/layouts',
  ],
  extensions: ['vue', 'md', 'page.vue'],
}

export const context = new Context(
  root,
  userOptions,
)
