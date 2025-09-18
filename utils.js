/*
 * @Author: machao
 * @Date: 2025-09-18 09:04:23
 * @LastEditors: machao
 * @Description: 版本信息工具类 - 提供版本信息获取、比较和格式化功能
 * @LastEditTime: 2025-09-18 09:07:07
 */

/**
 * 版本信息接口定义
 * @typedef {Object} VersionInfo
 * @property {string} version - 版本号
 * @property {string|null} tag - Git标签
 * @property {string} branch - Git分支
 * @property {string} commitHash - 提交哈希（短）
 * @property {string} fullCommitHash - 完整提交哈希
 * @property {string} [commitDate] - 提交时间
 * @property {string} [author] - 提交者
 * @property {string} buildTime - 构建时间（ISO格式）
 * @property {string} buildTimeFormatted - 格式化的构建时间
 * @property {string} generatedAt - 生成时间
 */

/**
 * 获取版本信息
 * @returns {VersionInfo|null} 版本信息对象或null
 */
export function getVersionInfo() {
  try {
    // 浏览器环境：从 window.VERSION_INFO 获取
    if (typeof window !== 'undefined' && window.VERSION_INFO) {
      return window.VERSION_INFO
    }

    // Node.js环境：尝试从不同路径加载版本文件
    if (typeof require !== 'undefined') {
      try {
        // 尝试加载当前目录的版本文件
        const versionPaths = ['./public/version.js', './dist/version.js', './version.js', '../public/version.js']

        for (const path of versionPaths) {
          try {
            const versionModule = require(path)
            if (versionModule && typeof versionModule === 'object') {
              return versionModule
            }
          } catch (e) {
            // 继续尝试下一个路径
            continue
          }
        }
      } catch (e) {
        // 忽略require错误
      }
    }

    // ES模块环境：尝试从全局变量获取
    if (typeof globalThis !== 'undefined' && globalThis.VERSION_INFO) {
      return globalThis.VERSION_INFO
    }

    return null
  } catch (error) {
    console.warn('⚠️ 获取版本信息时出错:', error.message)
    return null
  }
}

/**
 * 获取版本号
 * @returns {string} 版本号字符串
 */
export function getVersion() {
  const versionInfo = getVersionInfo()
  return versionInfo?.version || 'unknown'
}

/**
 * 获取Git标签
 * @returns {string} Git标签字符串
 */
export function getTag() {
  const versionInfo = getVersionInfo()
  return versionInfo?.tag || 'unknown'
}

/**
 * 获取分支名
 * @returns {string} 分支名字符串
 */
export function getBranch() {
  const versionInfo = getVersionInfo()
  return versionInfo?.branch || 'unknown'
}

/**
 * 获取提交哈希（短）
 * @returns {string} 提交哈希字符串
 */
export function getCommitHash() {
  const versionInfo = getVersionInfo()
  return versionInfo?.commitHash || 'unknown'
}

/**
 * 获取完整提交哈希
 * @returns {string} 完整提交哈希字符串
 */
export function getFullCommitHash() {
  const versionInfo = getVersionInfo()
  return versionInfo?.fullCommitHash || 'unknown'
}

/**
 * 获取提交时间
 * @returns {string} 提交时间字符串
 */
export function getCommitDate() {
  const versionInfo = getVersionInfo()
  return versionInfo?.commitDate || 'unknown'
}

/**
 * 获取提交者
 * @returns {string} 提交者字符串
 */
export function getAuthor() {
  const versionInfo = getVersionInfo()
  return versionInfo?.author || 'unknown'
}

/**
 * 获取构建时间（ISO格式）
 * @returns {string} 构建时间字符串
 */
export function getBuildTime() {
  const versionInfo = getVersionInfo()
  return versionInfo?.buildTime || 'unknown'
}

/**
 * 获取格式化的构建时间
 * @returns {string} 格式化的构建时间字符串
 */
export function getBuildTimeFormatted() {
  const versionInfo = getVersionInfo()
  return versionInfo?.buildTimeFormatted || 'unknown'
}

/**
 * 检查版本信息是否可用
 * @returns {boolean} 版本信息是否可用
 */
export function isVersionInfoAvailable() {
  return getVersionInfo() !== null
}

/**
 * 获取版本信息摘要
 * @returns {string} 版本信息摘要字符串
 */
export function getVersionSummary() {
  const versionInfo = getVersionInfo()
  if (!versionInfo) {
    return 'Version info not available'
  }

  const parts = [
    `v${versionInfo.version}`,
    versionInfo.tag && versionInfo.tag !== 'unknown' ? `(${versionInfo.tag})` : '',
    `${versionInfo.branch}`,
    `@${versionInfo.commitHash}`,
  ].filter(Boolean)

  return parts.join(' ')
}

/**
 * 比较两个版本号
 * @param {string} version1 - 第一个版本号
 * @param {string} version2 - 第二个版本号
 * @returns {number} 比较结果：-1(version1 < version2), 0(相等), 1(version1 > version2)
 */
export function compareVersions(version1, version2) {
  if (!version1 || !version2) {
    return 0
  }

  // 移除 'v' 前缀
  const v1 = version1.replace(/^v/, '')
  const v2 = version2.replace(/^v/, '')

  // 分割版本号
  const parts1 = v1.split('.').map((n) => parseInt(n, 10) || 0)
  const parts2 = v2.split('.').map((n) => parseInt(n, 10) || 0)

  // 补齐长度
  const maxLength = Math.max(parts1.length, parts2.length)
  while (parts1.length < maxLength) parts1.push(0)
  while (parts2.length < maxLength) parts2.push(0)

  // 逐位比较
  for (let i = 0; i < maxLength; i++) {
    if (parts1[i] < parts2[i]) return -1
    if (parts1[i] > parts2[i]) return 1
  }

  return 0
}

/**
 * 检查当前版本是否比指定版本新
 * @param {string} targetVersion - 目标版本号
 * @returns {boolean} 是否比目标版本新
 */
export function isNewerThan(targetVersion) {
  const currentVersion = getVersion()
  return compareVersions(currentVersion, targetVersion) > 0
}

/**
 * 检查当前版本是否比指定版本旧
 * @param {string} targetVersion - 目标版本号
 * @returns {boolean} 是否比目标版本旧
 */
export function isOlderThan(targetVersion) {
  const currentVersion = getVersion()
  return compareVersions(currentVersion, targetVersion) < 0
}

/**
 * 格式化构建时间
 * @param {string} [locale='zh-CN'] - 语言环境
 * @param {Object} [options] - 格式化选项
 * @returns {string} 格式化后的时间字符串
 */
export function formatBuildTime(locale = 'zh-CN', options = {}) {
  const versionInfo = getVersionInfo()
  if (!versionInfo?.buildTime || versionInfo.buildTime === 'unknown') {
    return 'unknown'
  }

  try {
    const date = new Date(versionInfo.buildTime)
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Shanghai',
    }

    return date.toLocaleString(locale, { ...defaultOptions, ...options })
  } catch (error) {
    console.warn('⚠️ 格式化构建时间失败:', error.message)
    return versionInfo.buildTime
  }
}

/**
 * 获取构建时间距离现在的时长
 * @returns {string} 时长描述
 */
export function getBuildTimeAgo() {
  const versionInfo = getVersionInfo()
  if (!versionInfo?.buildTime || versionInfo.buildTime === 'unknown') {
    return 'unknown'
  }

  try {
    const buildTime = new Date(versionInfo.buildTime)
    const now = new Date()
    const diffMs = now.getTime() - buildTime.getTime()

    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return '刚刚'
    if (diffMinutes < 60) return `${diffMinutes}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 30) return `${diffDays}天前`

    return formatBuildTime()
  } catch (error) {
    console.warn('⚠️ 计算构建时间失败:', error.message)
    return 'unknown'
  }
}

/**
 * 打印版本信息到控制台
 * @param {Object} [options] - 打印选项
 * @param {boolean} [options.detailed=false] - 是否显示详细信息
 * @param {boolean} [options.styled=true] - 是否使用样式
 */
export function printVersionInfo(options = {}) {
  const { detailed = false, styled = true } = options
  const versionInfo = getVersionInfo()

  if (!versionInfo) {
    console.warn('⚠️ 未找到版本信息')
    return
  }

  const style = styled ? 'color: #1890ff; font-weight: bold;' : ''

  console.group('🚀 应用版本信息')
  console.log(`%c📦 版本: ${versionInfo.version}`, styled ? 'color: #52c41a; font-weight: bold;' : '')

  if (versionInfo.tag && versionInfo.tag !== 'unknown') {
    console.log(`🏷️ 版本标签: ${versionInfo.tag}`)
  }

  console.log(`🌿 分支: ${versionInfo.branch}`)
  console.log(`📝 提交: ${versionInfo.commitHash}`)

  if (detailed) {
    console.log(`📝 完整哈希: ${versionInfo.fullCommitHash}`)
    if (versionInfo.author && versionInfo.author !== 'unknown') {
      console.log(`👤 作者: ${versionInfo.author}`)
    }
    if (versionInfo.commitDate && versionInfo.commitDate !== 'unknown') {
      console.log(`🕒 提交时间: ${versionInfo.commitDate}`)
    }
  }

  console.log(`🔨 构建时间: ${getBuildTimeFormatted()} (${getBuildTimeAgo()})`)

  if (detailed) {
    console.log(`📊 摘要: ${getVersionSummary()}`)
  }

  console.groupEnd()
}

/**
 * 创建版本信息徽章HTML
 * @param {Object} [options] - 徽章选项
 * @param {string} [options.style='flat'] - 徽章样式
 * @param {string} [options.color='blue'] - 徽章颜色
 * @returns {string} 徽章HTML字符串
 */
export function createVersionBadge(options = {}) {
  const { style = 'flat', color = 'blue' } = options
  const version = getVersion()
  const branch = getBranch()

  if (version === 'unknown') {
    return '<span style="color: #999;">Version info not available</span>'
  }

  return `<span style="
    display: inline-block;
    padding: 2px 8px;
    background-color: ${color === 'blue' ? '#1890ff' : color};
    color: white;
    border-radius: ${style === 'flat' ? '3px' : '12px'};
    font-size: 12px;
    font-family: monospace;
    font-weight: bold;
  ">v${version} @ ${branch}</span>`
}

// 默认导出版本信息获取函数
export default getVersionInfo

// 导出所有功能函数
export {
  // 基础信息获取
  getVersionInfo,
  getVersion,
  getTag,
  getBranch,
  getCommitHash,
  getFullCommitHash,
  getCommitDate,
  getAuthor,
  getBuildTime,
  getBuildTimeFormatted,

  // 状态检查
  isVersionInfoAvailable,
  getVersionSummary,

  // 版本比较
  compareVersions,
  isNewerThan,
  isOlderThan,

  // 时间格式化
  formatBuildTime,
  getBuildTimeAgo,

  // 显示功能
  printVersionInfo,
  createVersionBadge,
}
