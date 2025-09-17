const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Git信息缓存
let gitInfoCache = null
let cacheTimestamp = 0
const CACHE_DURATION = 5000 // 5秒缓存时间

/**
 * 检查是否在Git仓库中
 * @returns {boolean} 是否为Git仓库
 */
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { encoding: 'utf8', stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/**
 * 安全执行Git命令
 * @param {string} command - Git命令
 * @param {string} fallback - 失败时的默认值
 * @returns {string} 命令执行结果或默认值
 */
function safeExecGitCommand(command, fallback = '') {
  try {
    return execSync(command, {
      encoding: 'utf8',
      timeout: 5000,
      stdio: 'pipe',
    }).trim()
  } catch (error) {
    console.warn(`⚠️ Git命令执行失败: ${command}, 使用默认值: ${fallback}`)
    return fallback
  }
}

/**
 * 验证输入参数
 * @param {string} outputPath - 输出路径
 * @param {RegExp} rule - 版本规则
 */
function validateParams(outputPath, rule) {
  if (typeof outputPath !== 'string' || outputPath.trim() === '') {
    throw new Error('输出路径必须是非空字符串')
  }

  if (!(rule instanceof RegExp)) {
    throw new Error('版本规则必须是正则表达式')
  }
}

/**
 * 获取缓存的Git信息或重新获取
 * @param {Object} options - 配置选项
 * @returns {Object} Git信息对象
 */
function getCachedGitInfo(options = {}) {
  const now = Date.now()

  // 如果缓存有效且未过期，直接返回缓存
  if (gitInfoCache && now - cacheTimestamp < CACHE_DURATION) {
    return gitInfoCache
  }

  const { includeAuthor = true, includeCommitDate = true } = options

  // 批量获取所有Git信息，减少命令执行次数
  const gitCommands = {
    branch: 'git rev-parse --abbrev-ref HEAD',
    commitHash: 'git rev-parse --short HEAD',
    fullCommitHash: 'git rev-parse HEAD',
    tag: 'git describe --tags --exact-match HEAD 2>/dev/null',
    tagFallback: 'git describe --tags --abbrev=0 2>/dev/null',
  }

  // 可选命令
  if (includeCommitDate) {
    gitCommands.commitDate = 'git log -1 --format=%cd --date=iso'
  }

  if (includeAuthor) {
    gitCommands.author = 'git log -1 --format=%an'
  }

  // 批量执行Git命令
  const gitInfo = {}
  for (const [key, command] of Object.entries(gitCommands)) {
    gitInfo[key] = safeExecGitCommand(command, key === 'tag' || key === 'tagFallback' ? '' : 'unknown')
  }

  // 处理tag的fallback逻辑
  if (!gitInfo.tag && gitInfo.tagFallback) {
    gitInfo.tag = gitInfo.tagFallback
  }
  delete gitInfo.tagFallback

  // 缓存结果
  gitInfoCache = gitInfo
  cacheTimestamp = now

  return gitInfo
}

/**
 * 获取Git版本信息并生成版本文件
 * @param {string} outputPath - 输出文件目录，默认为 'public'
 * @param {RegExp} rule - 版本号规则，默认为 /.+-/
 * @param {Object} options - 额外配置选项
 * @returns {Object} 版本信息对象
 */
function generateVersionFile(outputPath = 'public', rule = /.+-/, options = {}) {
  try {
    // 验证输入参数
    validateParams(outputPath, rule)

    // 检查是否为Git仓库
    if (!isGitRepository()) {
      throw new Error('当前目录不是Git仓库，无法获取版本信息')
    }

    const { includeAuthor = true, includeCommitDate = true, customFields = {}, timeZone = 'Asia/Shanghai' } = options

    // 获取缓存的Git信息
    const gitInfo = getCachedGitInfo({ includeAuthor, includeCommitDate })

    // 生成构建时间
    const buildTime = new Date().toISOString()
    const buildTimeFormatted = new Date().toLocaleString('zh-CN', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const version = gitInfo.branch.replace(rule, '')

    // 创建版本信息对象
    const versionInfo = {
      version,
      tag: gitInfo.tag || null,
      branch: gitInfo.branch,
      commitHash: gitInfo.commitHash,
      fullCommitHash: gitInfo.fullCommitHash,
      ...(includeCommitDate && gitInfo.commitDate && { commitDate: gitInfo.commitDate }),
      ...(includeAuthor && gitInfo.author && { author: gitInfo.author }),
      buildTime,
      buildTimeFormatted,
      generatedAt: buildTime,
      ...customFields, // 允许用户添加自定义字段
    }

    // 生成文件内容
    const generators = {
      json: () => JSON.stringify(versionInfo, null, 2),
      js: () => `// 自动生成的版本信息文件 - 请勿手动修改
// 生成时间: ${buildTimeFormatted}

;(function() {
  'use strict';
  
  var versionInfo = ${JSON.stringify(versionInfo, null, 2)};
  
  // 浏览器环境
  if (typeof window !== 'undefined') {
    window.VERSION_INFO = versionInfo;
  }
  
  // Node.js环境
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = versionInfo;
  }
  
  // AMD环境
  if (typeof define === 'function' && define.amd) {
    define(function() { return versionInfo; });
  }
  
  // ES6模块环境
  if (typeof exports === 'object') {
    Object.assign(exports, versionInfo);
  }
})();`,
      txt: () => `项目版本信息
=============
版本: ${version || '未知'}
版本标签: ${gitInfo.tag || '无'}
分支: ${gitInfo.branch || '未知'}
提交哈希: ${gitInfo.commitHash || '未知'}
完整哈希: ${gitInfo.fullCommitHash || '未知'}
${includeCommitDate && gitInfo.commitDate ? `提交时间: ${gitInfo.commitDate}\n` : ''}${
        includeAuthor && gitInfo.author ? `提交者: ${gitInfo.author}\n` : ''
      }生成时间: ${buildTimeFormatted}
构建环境: ${process.env.NODE_ENV || 'development'}
Node版本: ${process.version}`,
      ts: () => `// 自动生成的版本信息文件 - 请勿手动修改
// 生成时间: ${buildTimeFormatted}

export interface VersionInfo {
  version: string;
  tag: string | null;
  branch: string;
  commitHash: string;
  fullCommitHash: string;
  ${includeCommitDate ? 'commitDate?: string;' : ''}
  ${includeAuthor ? 'author?: string;' : ''}
  buildTime: string;
  buildTimeFormatted: string;
  generatedAt: string;
}

export const VERSION_INFO: VersionInfo = ${JSON.stringify(versionInfo, null, 2)};

export default VERSION_INFO;

// 向后兼容
declare global {
  interface Window {
    VERSION_INFO: VersionInfo;
  }
}

if (typeof window !== 'undefined') {
  window.VERSION_INFO = VERSION_INFO;
}`,
    }

    // 确保输出目录存在
    const outputDir = path.resolve(process.cwd(), outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 默认生成的文件类型
    const defaultFiles = ['json', 'js', 'txt']
    const filesToGenerate = options.files || defaultFiles

    // 写入文件
    const generatedFiles = []
    filesToGenerate.forEach((fileType) => {
      if (!generators[fileType]) {
        console.warn(`⚠️ 不支持的文件类型: ${fileType}`)
        return
      }

      const filePath = path.join(outputDir, `version.${fileType}`)
      const content = generators[fileType]()

      try {
        fs.writeFileSync(filePath, content, 'utf8')
        generatedFiles.push(filePath)
        console.log(`✅ 版本文件已生成: ${filePath}`)
      } catch (error) {
        console.error(`❌ 生成文件失败 ${filePath}: ${error.message}`)
      }
    })

    if (generatedFiles.length > 0) {
      console.log('🎉 版本信息文件生成完成！')
      console.log(`📦 版本: ${version || '未知'}`)
      console.log(`🏷️ 标签: ${gitInfo.tag || '无'}`)
      console.log(`🌿 分支: ${gitInfo.branch || '未知'}`)
      console.log(`📝 提交: ${gitInfo.commitHash || '未知'}`)
      console.log(`🕒 构建时间: ${buildTimeFormatted}`)
    }

    return versionInfo
  } catch (error) {
    console.error('❌ 生成版本文件时出错:', error.message)

    // 在非Git仓库中生成基础版本信息
    if (error.message.includes('Git仓库')) {
      console.warn('⚠️ 正在生成基础版本信息（非Git环境）')
      const fallbackInfo = {
        version: 'unknown',
        tag: null,
        branch: 'unknown',
        commitHash: 'unknown',
        fullCommitHash: 'unknown',
        buildTime: new Date().toISOString(),
        buildTimeFormatted: new Date().toLocaleString('zh-CN'),
        generatedAt: new Date().toISOString(),
        ...options.customFields,
      }

      return fallbackInfo
    }

    throw error
  }
}

/**
 * 清理Git信息缓存
 */
function clearGitInfoCache() {
  gitInfoCache = null
  cacheTimestamp = 0
}

/**
 * 获取缓存状态
 * @returns {Object} 缓存信息
 */
function getCacheStatus() {
  return {
    cached: !!gitInfoCache,
    timestamp: cacheTimestamp,
    age: gitInfoCache ? Date.now() - cacheTimestamp : 0,
    valid: gitInfoCache && Date.now() - cacheTimestamp < CACHE_DURATION,
  }
}

module.exports = generateVersionFile
module.exports.clearCache = clearGitInfoCache
module.exports.getCacheStatus = getCacheStatus
