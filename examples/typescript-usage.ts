/**
 * TypeScript 使用示例
 * 展示如何在TypeScript项目中使用vite-plugin-generate-version
 */

// ==================== 插件配置示例 ====================

import { defineConfig } from 'vite'
import generateVersion, { type PluginOptions } from 'vite-plugin-generate-version'

// 完整的插件配置
const versionConfig: PluginOptions = {
  path: 'public',
  files: ['json', 'js', 'ts'],
  injectScript: true,
  includeAuthor: true,
  includeCommitDate: true,
  customFields: {
    buildNumber: process.env.BUILD_NUMBER || '1',
    environment: process.env.NODE_ENV || 'development',
    buildType: 'release',
  },
  generateOnDev: false,
  silent: false,
  logLevel: 'info',
}

export default defineConfig({
  plugins: [generateVersion(versionConfig)],
})

// ==================== 工具类使用示例 ====================

import {
  getVersionInfo,
  getVersion,
  getBranch,
  getCommitHash,
  getBuildTimeAgo,
  compareVersions,
  isNewerThan,
  printVersionInfo,
  createVersionBadge,
  type VersionInfo,
  type CompareResult,
  type PrintOptions,
  type BadgeOptions,
} from 'vite-plugin-generate-version/utils'

// 基础信息获取
const versionInfo: VersionInfo | null = getVersionInfo()
const version: string = getVersion()
const branch: string = getBranch()
const commitHash: string = getCommitHash()
const buildTimeAgo: string = getBuildTimeAgo()

console.log(`当前版本: ${version}`)
console.log(`分支: ${branch}`)
console.log(`提交: ${commitHash}`)
console.log(`构建时间: ${buildTimeAgo}`)

// 版本比较
const compareResult: CompareResult = compareVersions('1.2.3', '1.2.4')
const isNewer: boolean = isNewerThan('1.2.0')

if (compareResult === -1) {
  console.log('版本1小于版本2')
} else if (compareResult === 1) {
  console.log('版本1大于版本2')
} else {
  console.log('版本相等')
}

// 打印版本信息
const printOptions: PrintOptions = {
  detailed: true,
  styled: true,
}
printVersionInfo(printOptions)

// 创建版本徽章
const badgeOptions: BadgeOptions = {
  style: 'rounded',
  color: '#52c41a',
}
const badge: string = createVersionBadge(badgeOptions)

// ==================== React组件示例 ====================

import React from 'react'

interface VersionDisplayProps {
  showDetailed?: boolean
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({ showDetailed = false }) => {
  const versionInfo = getVersionInfo()

  if (!versionInfo) {
    return <div>版本信息不可用</div>
  }

  return (
    <div className="version-info">
      <h3>版本信息</h3>
      <p>版本: {versionInfo.version}</p>
      <p>分支: {versionInfo.branch}</p>
      <p>提交: {versionInfo.commitHash}</p>

      {showDetailed && (
        <>
          <p>完整哈希: {versionInfo.fullCommitHash}</p>
          {versionInfo.author && <p>作者: {versionInfo.author}</p>}
          {versionInfo.commitDate && <p>提交时间: {versionInfo.commitDate}</p>}
        </>
      )}

      <p>
        构建时间: {versionInfo.buildTimeFormatted} ({getBuildTimeAgo()})
      </p>

      <div
        dangerouslySetInnerHTML={{
          __html: createVersionBadge({ style: 'rounded', color: '#1890ff' }),
        }}
      />
    </div>
  )
}

// ==================== Vue组件示例 ====================

import { defineComponent, computed } from 'vue'

export const VersionInfoComponent = defineComponent({
  name: 'VersionInfo',
  props: {
    detailed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const versionInfo = computed(() => getVersionInfo())
    const versionBadge = computed(() => createVersionBadge({ style: 'rounded', color: '#409eff' }))

    return {
      versionInfo,
      versionBadge,
      getBuildTimeAgo,
    }
  },
  template: `
    <div v-if="versionInfo" class="version-info">
      <h3>版本信息</h3>
      <p>版本: {{ versionInfo.version }}</p>
      <p>分支: {{ versionInfo.branch }}</p>
      <p>提交: {{ versionInfo.commitHash }}</p>
      
      <template v-if="detailed">
        <p>完整哈希: {{ versionInfo.fullCommitHash }}</p>
        <p v-if="versionInfo.author">作者: {{ versionInfo.author }}</p>
        <p v-if="versionInfo.commitDate">提交时间: {{ versionInfo.commitDate }}</p>
      </template>
      
      <p>构建时间: {{ versionInfo.buildTimeFormatted }} ({{ getBuildTimeAgo() }})</p>
      
      <div v-html="versionBadge"></div>
    </div>
    <div v-else>
      版本信息不可用
    </div>
  `,
})

// ==================== 自定义Hook示例 ====================

import { useState, useEffect } from 'react'

interface UseVersionInfoReturn {
  versionInfo: VersionInfo | null
  isLoading: boolean
  error: string | null
}

export function useVersionInfo(): UseVersionInfoReturn {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const info = getVersionInfo()
      setVersionInfo(info)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取版本信息失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { versionInfo, isLoading, error }
}

// ==================== 版本检查工具函数 ====================

/**
 * 检查是否需要更新
 */
export function checkForUpdates(latestVersion: string): {
  needsUpdate: boolean
  currentVersion: string
  latestVersion: string
  compareResult: CompareResult
} {
  const currentVersion = getVersion()
  const compareResult = compareVersions(currentVersion, latestVersion)

  return {
    needsUpdate: compareResult === -1,
    currentVersion,
    latestVersion,
    compareResult,
  }
}

/**
 * 格式化版本信息为字符串
 */
export function formatVersionString(template: string = 'v{version} @ {branch} ({hash})'): string {
  const versionInfo = getVersionInfo()

  if (!versionInfo) {
    return 'Version info not available'
  }

  return template
    .replace('{version}', versionInfo.version)
    .replace('{branch}', versionInfo.branch)
    .replace('{hash}', versionInfo.commitHash)
    .replace('{tag}', versionInfo.tag || 'no-tag')
    .replace('{author}', versionInfo.author || 'unknown')
    .replace('{buildTime}', versionInfo.buildTimeFormatted)
}

// ==================== 类型守卫函数 ====================

/**
 * 检查是否为有效的版本信息对象
 */
export function isValidVersionInfo(obj: any): obj is VersionInfo {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.version === 'string' &&
    typeof obj.branch === 'string' &&
    typeof obj.commitHash === 'string' &&
    typeof obj.buildTime === 'string'
  )
}

// ==================== 使用示例 ====================

// 在应用启动时打印版本信息
if (process.env.NODE_ENV === 'development') {
  printVersionInfo({ detailed: true })
}

// 检查更新
const updateCheck = checkForUpdates('1.3.0')
if (updateCheck.needsUpdate) {
  console.log(`发现新版本: ${updateCheck.latestVersion}，当前版本: ${updateCheck.currentVersion}`)
}

// 格式化版本字符串
const versionString = formatVersionString('Version {version} built from {branch}@{hash}')
console.log(versionString)
