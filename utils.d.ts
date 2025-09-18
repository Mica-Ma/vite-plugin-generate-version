/**
 * 版本信息工具类 TypeScript 声明文件
 * 提供版本信息获取、比较和格式化功能的类型定义
 */

// 导入主包的类型定义
import type { VersionInfo } from './index'

// 重新导出 VersionInfo 类型以保持向后兼容
export type { VersionInfo }

/**
 * 版本比较结果
 * -1: version1 < version2
 * 0: version1 === version2
 * 1: version1 > version2
 */
export type CompareResult = -1 | 0 | 1

/**
 * 打印选项接口
 */
export interface PrintOptions {
  /** 是否显示详细信息，默认为 false */
  detailed?: boolean
  /** 是否使用样式，默认为 true */
  styled?: boolean
}

/**
 * 徽章选项接口
 */
export interface BadgeOptions {
  /** 徽章样式，默认为 'flat' */
  style?: 'flat' | 'rounded'
  /** 徽章颜色，默认为 'blue' */
  color?: string
}

/**
 * 时间格式化选项接口
 */
export interface FormatTimeOptions {
  /** 年份格式 */
  year?: 'numeric' | '2-digit'
  /** 月份格式 */
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  /** 日期格式 */
  day?: 'numeric' | '2-digit'
  /** 小时格式 */
  hour?: 'numeric' | '2-digit'
  /** 分钟格式 */
  minute?: 'numeric' | '2-digit'
  /** 秒格式 */
  second?: 'numeric' | '2-digit'
  /** 时区 */
  timeZone?: string
  /** 小时制 */
  hour12?: boolean
}

// ==================== 基础信息获取 ====================

/**
 * 获取版本信息
 * @returns 版本信息对象或null
 */
export declare function getVersionInfo(): VersionInfo | null

/**
 * 获取版本号
 * @returns 版本号字符串
 */
export declare function getVersion(): string

/**
 * 获取Git标签
 * @returns Git标签字符串
 */
export declare function getTag(): string

/**
 * 获取分支名
 * @returns 分支名字符串
 */
export declare function getBranch(): string

/**
 * 获取提交哈希（短）
 * @returns 提交哈希字符串
 */
export declare function getCommitHash(): string

/**
 * 获取完整提交哈希
 * @returns 完整提交哈希字符串
 */
export declare function getFullCommitHash(): string

/**
 * 获取提交时间
 * @returns 提交时间字符串
 */
export declare function getCommitDate(): string

/**
 * 获取提交者
 * @returns 提交者字符串
 */
export declare function getAuthor(): string

/**
 * 获取构建时间（ISO格式）
 * @returns 构建时间字符串
 */
export declare function getBuildTime(): string

/**
 * 获取格式化的构建时间
 * @returns 格式化的构建时间字符串
 */
export declare function getBuildTimeFormatted(): string

// ==================== 状态检查 ====================

/**
 * 检查版本信息是否可用
 * @returns 版本信息是否可用
 */
export declare function isVersionInfoAvailable(): boolean

/**
 * 获取版本信息摘要
 * @returns 版本信息摘要字符串
 */
export declare function getVersionSummary(): string

// ==================== 版本比较 ====================

/**
 * 比较两个版本号
 * @param version1 第一个版本号
 * @param version2 第二个版本号
 * @returns 比较结果：-1(version1 < version2), 0(相等), 1(version1 > version2)
 */
export declare function compareVersions(version1: string, version2: string): CompareResult

/**
 * 检查当前版本是否比指定版本新
 * @param targetVersion 目标版本号
 * @returns 是否比目标版本新
 */
export declare function isNewerThan(targetVersion: string): boolean

/**
 * 检查当前版本是否比指定版本旧
 * @param targetVersion 目标版本号
 * @returns 是否比目标版本旧
 */
export declare function isOlderThan(targetVersion: string): boolean

// ==================== 时间格式化 ====================

/**
 * 格式化构建时间
 * @param locale 语言环境，默认为 'zh-CN'
 * @param options 格式化选项
 * @returns 格式化后的时间字符串
 */
export declare function formatBuildTime(locale?: string, options?: FormatTimeOptions): string

/**
 * 获取构建时间距离现在的时长
 * @returns 时长描述
 */
export declare function getBuildTimeAgo(): string

// ==================== 显示功能 ====================

/**
 * 打印版本信息到控制台
 * @param options 打印选项
 */
export declare function printVersionInfo(options?: PrintOptions): void

/**
 * 创建版本信息徽章HTML
 * @param options 徽章选项
 * @returns 徽章HTML字符串
 */
export declare function createVersionBadge(options?: BadgeOptions): string

// ==================== 默认导出 ====================

/**
 * 默认导出版本信息获取函数
 */
declare const _getVersionInfo: () => VersionInfo | null
export default _getVersionInfo

// ==================== 扩展全局类型 ====================

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
