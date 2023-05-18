import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/options'
import { root, userOptions } from './fixtures/context'

describe('test options', () => {
  it('should options resolved', () => {
    const options = resolveOptions(root, userOptions)

    expect(options.extensions).toStrictEqual(['page.vue', 'vue', 'md'])
    expect(options.dirs[0].filePattern).toBe('**/*.{page.vue,vue,md}')
  })
})
