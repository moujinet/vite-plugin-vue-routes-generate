import { describe, expect, it } from 'vitest'
import { context } from './fixtures/context'

describe('routes', () => {
  it('generate routes nested array', async () => {
    await context.pages.scan()
    expect((await context.routes.resolveRoutes()).length).toBeGreaterThan(0)
  })

  it('generate client code', async () => {
    await context.pages.scan()
    expect((await context.routes.getClientCode()).includes('export default routes;')).toBeTruthy()
  })
})
