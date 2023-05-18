import { describe, expect, it } from 'vitest'
import {
  extsToGlob,
  globToRegex,
  parseRoutePath,
  trimSlash,
} from '../src/utils'

type TrimSlashMode = '' | 'left' | 'right'

describe('test utils', () => {
  it('trim slash', () => {
    [
      [['/', '', false], ''],
      [['/', 'left', false], ''],
      [['/', 'right', false], ''],
      [['/', '', true], '/'],
      [['/', 'left', true], '/'],
      [['/', 'right', true], '/'],
      [['/foo/', '', false], 'foo'],
      [['/foo/', 'left', false], 'foo/'],
      [['/foo/', 'right', false], '/foo'],
    ].forEach(
      ([[path, mode, skipSingle], result]) => {
        expect(
          trimSlash(
            path as string,
            mode as TrimSlashMode,
            skipSingle as boolean,
          ),
        ).toBe(result)
      })
  })

  it('extensions to glob', () => {
    expect(extsToGlob(['vue'])).toBe('vue')
    expect(extsToGlob(['vue', 'md'])).toBe('{vue,md}')
  })

  it('glob to regex', () => {
    [
      [
        'src/docs/**/pages/**/*.*',
        /(?<=src\/docs\/)\S+(?=\/pages\/)|(?<=\/pages\/)\S+(?=\.)/g,
      ],
      [
        'src/docs/**/pages/**/*.{page.vue,vue,ts}',
        /(?<=src\/docs\/)\S+(?=\/pages\/)|(?<=\/pages\/)\S+(?=\.(page\.vue|vue|ts))/g,
      ],
      [
        'src/docs/pages/**/*.{vue,ts}',
        /(?<=src\/docs\/pages\/)\S+(?=\.(vue|ts))/g,
      ],
    ].map(([glob, re]) =>
      expect(globToRegex(glob as string)).toStrictEqual(re as RegExp))
  })

  it('parse route path', () => {
    [
      ['/[...all]', '/:all(.*)*'],
      ['/[[name]]+', '/:name*'],
      ['/[[name]]', '/:name?'],
      ['/[name]+', '/:name+'],
      ['/[name]?', '/:name?'],
      ['/[name]', '/:name'],
      ['/user/index', '/user'],
      ['/index', '/'],
    ].forEach(([path, result]) => {
      expect(parseRoutePath(path)).toBe(result)
    })
  })
})
