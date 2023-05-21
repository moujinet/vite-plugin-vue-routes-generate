import { describe, expect, it } from 'vitest'
import { context } from './fixtures/context'

describe('pages', () => {
  it('scan pages', async () => {
    await context.pages.scan()
    const pages = context.pages.toArray()

    expect(pages.length).toBeGreaterThan(0)
  })
})
