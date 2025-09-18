import { Plugin } from 'vite'

export interface VersionInfo {
  /** 版本号（从分支名提取） */
  version: string
  /** Git标签 */
  tag: string | null
  /** Git分支名 */
  branch: string
  /** 短格式提交哈希 */
  commitHash: string
  /** 完整格式提交哈希 */
  fullCommitHash: string
  /** 提交日期（可选） */
  commitDate?: string
  /** 提交者（可选） */
  author?: string
  /** 构建时间（ISO格式） */
  buildTime: string
  /** 格式化的构建时间 */
  buildTimeFormatted: string
  /** 生成时间（同buildTime） */
  generatedAt: string
  /** 自定义字段 */
  [key: string]: any
}

export type FileType = 'json' | 'js' | 'txt' | 'ts'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export type TransformFunction = (code: string, id: string) => string | { code: string; map?: any } | null

export interface PluginOptions {
  /** 版本文件输出目录，默认为 'public' */
  path?: string

  /** 版本号提取规则，默认为 /.+-/ */
  rule?: RegExp

  /** 是否自动注入version.js到HTML，默认为true */
  injectScript?: boolean

  /** 是否启用代码转换功能，默认为false。可以是boolean或转换函数 */
  enableTransform?: boolean | TransformFunction

  /** 是否静默模式，默认为false */
  silent?: boolean

  /** 要生成的文件类型，默认为 ['json', 'js', 'txt'] */
  files?: FileType[]

  /** 注入的脚本路径，默认为 '/version.js' */
  scriptPath?: string

  /** 是否包含作者信息，默认为true */
  includeAuthor?: boolean

  /** 是否包含提交日期，默认为true */
  includeCommitDate?: boolean

  /** 时区，默认为 'Asia/Shanghai' */
  timeZone?: string

  /** 自定义字段 */
  customFields?: Record<string, any>

  /** 是否在开发模式下生成，默认为false */
  generateOnDev?: boolean

  /** 是否添加缓存破坏参数，默认为true */
  cacheBuster?: boolean

  /** 日志级别，默认为 'info' */
  logLevel?: LogLevel
}

export interface VitePluginGenerateVersion extends Plugin {
  /** 获取版本信息 */
  getVersionInfo(): VersionInfo | null
}

/**
 * Vite插件：自动生成版本信息
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'vite'
 * import generateVersion from 'vite-plugin-generate-version'
 *
 * export default defineConfig({
 *   plugins: [
 *     generateVersion({
 *       path: 'public',
 *       files: ['json', 'js', 'ts'],
 *       injectScript: true,
 *       customFields: {
 *         buildNumber: process.env.BUILD_NUMBER || '1'
 *       }
 *     })
 *   ]
 * })
 * ```
 *
 * @param options - 插件配置选项
 * @returns Vite插件对象
 */
declare function generateVersionVitePlugin(options?: PluginOptions): VitePluginGenerateVersion

export default generateVersionVitePlugin
export { generateVersionVitePlugin }

// 重新导出工具类类型
export type { VersionInfo, CompareResult, PrintOptions, BadgeOptions, FormatTimeOptions } from './utils'

// 扩展全局类型
declare global {
  interface Window {
    /** 版本信息对象 */
    VERSION_INFO: VersionInfo
  }

  interface GlobalThis {
    /** 版本信息对象 */
    VERSION_INFO: VersionInfo
  }
}
