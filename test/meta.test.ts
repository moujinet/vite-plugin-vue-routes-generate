import { describe, expect, it } from 'vitest'
import { resolveRoutesMeta } from '../src/meta'
import { context } from './fixtures/context'

describe('routes', () => {
  it('generate routes nested array', async () => {
    await context.pages.scan()
    expect((await resolveRoutesMeta(context)).length).toBeGreaterThan(0)
  })
})
