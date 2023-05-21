export interface UserScanDirOption {
  /**
   * 路由导入文件夹搜索路径
   */
  src: string
  /**
   * 路由路径前缀
   *
   * @default ''
   */
  prefix?: string
  /**
   * 文件过滤条件
   */
  filePattern?: string
}

export type ScanDirOption = Required<UserScanDirOption>

export interface Options {
  /**
   * 路由导入搜索路径
   *
   * @default 'src/pages'
   */
  dirs: string | (string | UserScanDirOption)[]
  /**
   * 默认布局
   *
   * @default false
   */
  defaultLayout: false | string
  /**
   * 允许文件扩展名的范围
   *
   * @default ['vue']
   */
  extensions: string[]
  /**
   * 排除条件，支持 RegExp 及 glob, 匹配成功的文件将不转换
   *
   * @default ['node_modules', '.git', '**\/__*__\/**']
   */
  exclude: string[]
  /**
   * 路由路径大小写
   *
   * @default false
   */
  caseSensitive: boolean
  /**
   * 默认的路由标签解析器，<route lang="xxx">
   *
   * @default 'json'
   */
  routeBlockLang: 'json' | 'json5' | 'yaml' | 'yml'
  /**
   * 路由导入方式，直接导入路由或作为异步组件导入路由
   *
   * @default 'async'
   */
  importMode: 'async' | 'sync'
}

export type UserOptions = Partial<Options>

export interface ResolvedOptions extends Omit<Options, 'dirs'> {
  /**
   * 路由导入搜索路径
   */
  dirs: ScanDirOption[]
}

export interface PageInfo {
  /**
   * 文件路径
   */
  file: string
  /**
   * 路由路径
   */
  path: string
}

export interface PageRouteMeta {
  [key: string]: any
}

export interface PageRoute {
  name: string
  path: string
  component: string
  props?: boolean
  isLayout?: boolean
  meta?: PageRouteMeta
  customBlock?: CustomBlock
  children?: PageRoute[]
  rawPath?: string
}

export interface PageResolver {
  /**
   * 获取页面
   *
   * @param path 页面路径
   */
  get: (path: string) => PageInfo | undefined
  /**
   * 添加页面
   *
   * @param path 页面路径
   * @param dir 路径配置
   */
  add: (path: string, dir: ScanDirOption) => Promise<void>
  /**
   * 删除页面
   *
   * @param path 页面路径
   */
  remove: (path: string) => Promise<void>
  /**
   * 执行扫描
   *
   * @param options 全局配置
   */
  scan: () => Promise<void>
  /**
   * 获取所有页面数组
   */
  toArray: () => PageInfo[]
}

export type CustomBlock = Record<string, any>

export interface RouteResolver {
  /**
   * 自定义标签解析器
   */
  customBlock: CustomBlockParser
  /**
   * 生成路由数组
   */
  resolveRoutes: () => Promise<PageRoute[]>
  /**
   * 检查路由更新
   *
   * @param path 文件路径
   */
  checkUpdate: (path: string) => Promise<void>
  /**
   * 获取客户端路由代码
   */
  getClientCode: () => Promise<string>
  /**
   * 获取路由元信息
   */
  getRoutesMeta: () => Promise<string>
}

export interface CustomBlockParser {
  /**
   * 获取指定文件的路由标签
   *
   * @param path 文件路径
   */
  get: (path: string) => CustomBlock | undefined
  /**
   * 删除指定文件的路由标签
   *
   * @param path 文件路径
   */
  remove: (path: string) => Promise<void>
  /**
   * 检查路由更新
   *
   * @param path 文件路径
   */
  checkUpdate: (path: string) => Promise<void>
}
