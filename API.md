# API 文档

## 工具类 API 参考

### 导入方式

#### JavaScript (ES6 模块)
```javascript
// ES模块导入
import {
  getVersionInfo,
  getVersion,
  getBranch,
  printVersionInfo,
  compareVersions,
  // ... 其他函数
} from 'vite-plugin-generate-version/utils.js'

// 默认导入
import getVersionInfo from 'vite-plugin-generate-version/utils.js'

// 混合导入
import getVersionInfo, { getVersion, getBranch } from 'vite-plugin-generate-version/utils.js'
```

#### TypeScript
```typescript
// 带类型的导入
import {
  getVersionInfo,
  getVersion,
  getBranch,
  printVersionInfo,
  compareVersions,
  type VersionInfo,
  type CompareResult,
  type PrintOptions,
  type BadgeOptions
} from 'vite-plugin-generate-version/utils'

// 或者使用 .js 扩展名
import type { VersionInfo } from 'vite-plugin-generate-version/utils.js'
```

## 基础信息获取

### `getVersionInfo()`
获取完整的版本信息对象。

**返回值**: `VersionInfo | null`

```javascript
const versionInfo = getVersionInfo()
console.log(versionInfo)
// {
//   version: "1.2.3",
//   tag: "v1.2.3",
//   branch: "main",
//   commitHash: "abc1234",
//   fullCommitHash: "abc1234567890...",
//   commitDate: "2023-12-01T10:00:00+08:00",
//   author: "开发者",
//   buildTime: "2023-12-01T10:30:00.000Z",
//   buildTimeFormatted: "2023/12/01 18:30:00"
// }
```

### `getVersion()`
获取版本号。

**返回值**: `string`

```javascript
const version = getVersion() // "1.2.3"
```

### `getTag()`
获取Git标签。

**返回值**: `string`

```javascript
const tag = getTag() // "v1.2.3"
```

### `getBranch()`
获取分支名。

**返回值**: `string`

```javascript
const branch = getBranch() // "main"
```

### `getCommitHash()`
获取提交哈希（短）。

**返回值**: `string`

```javascript
const hash = getCommitHash() // "abc1234"
```

### `getFullCommitHash()`
获取完整提交哈希。

**返回值**: `string`

```javascript
const fullHash = getFullCommitHash() // "abc1234567890abcdef..."
```

### `getCommitDate()`
获取提交时间。

**返回值**: `string`

```javascript
const date = getCommitDate() // "2023-12-01T10:00:00+08:00"
```

### `getAuthor()`
获取提交者。

**返回值**: `string`

```javascript
const author = getAuthor() // "开发者"
```

### `getBuildTime()`
获取构建时间（ISO格式）。

**返回值**: `string`

```javascript
const buildTime = getBuildTime() // "2023-12-01T10:30:00.000Z"
```

### `getBuildTimeFormatted()`
获取格式化的构建时间。

**返回值**: `string`

```javascript
const formatted = getBuildTimeFormatted() // "2023/12/01 18:30:00"
```

## 状态检查

### `isVersionInfoAvailable()`
检查版本信息是否可用。

**返回值**: `boolean`

```javascript
if (isVersionInfoAvailable()) {
  console.log('版本信息可用')
}
```

### `getVersionSummary()`
获取版本信息摘要。

**返回值**: `string`

```javascript
const summary = getVersionSummary() // "v1.2.3 main @abc1234"
```

## 版本比较

### `compareVersions(version1, version2)`
比较两个版本号。

**参数**:
- `version1` (string): 第一个版本号
- `version2` (string): 第二个版本号

**返回值**: `number` (-1, 0, 1)

```javascript
console.log(compareVersions('1.2.3', '1.2.4')) // -1 (version1 < version2)
console.log(compareVersions('1.2.4', '1.2.3')) // 1  (version1 > version2)
console.log(compareVersions('1.2.3', '1.2.3')) // 0  (相等)
```

### `isNewerThan(targetVersion)`
检查当前版本是否比指定版本新。

**参数**:
- `targetVersion` (string): 目标版本号

**返回值**: `boolean`

```javascript
const isNewer = isNewerThan('1.2.0') // true (如果当前版本是1.2.3)
```

### `isOlderThan(targetVersion)`
检查当前版本是否比指定版本旧。

**参数**:
- `targetVersion` (string): 目标版本号

**返回值**: `boolean`

```javascript
const isOlder = isOlderThan('1.3.0') // true (如果当前版本是1.2.3)
```

## 时间格式化

### `formatBuildTime(locale, options)`
自定义格式化构建时间。

**参数**:
- `locale` (string, 可选): 语言环境，默认 'zh-CN'
- `options` (Object, 可选): 格式化选项

**返回值**: `string`

```javascript
const formatted = formatBuildTime('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}) // "Dec 1, 2023"
```

### `getBuildTimeAgo()`
获取构建时间距离现在的时长。

**返回值**: `string`

```javascript
const timeAgo = getBuildTimeAgo() // "2小时前" 或 "3天前"
```

## 显示功能

### `printVersionInfo(options)`
打印版本信息到控制台。

**参数**:
- `options` (Object, 可选): 打印选项
  - `detailed` (boolean): 是否显示详细信息，默认 false
  - `styled` (boolean): 是否使用样式，默认 true

**返回值**: `void`

```javascript
// 基础打印
printVersionInfo()

// 详细打印
printVersionInfo({ detailed: true, styled: true })
```

### `createVersionBadge(options)`
创建版本信息徽章HTML。

**参数**:
- `options` (Object, 可选): 徽章选项
  - `style` (string): 徽章样式，'flat' 或 'rounded'，默认 'flat'
  - `color` (string): 徽章颜色，默认 'blue'

**返回值**: `string` (HTML字符串)

```javascript
const badge = createVersionBadge({
  style: 'rounded',
  color: '#52c41a'
})

document.getElementById('version').innerHTML = badge
```

## 类型定义

```typescript
interface VersionInfo {
  version: string
  tag: string | null
  branch: string
  commitHash: string
  fullCommitHash: string
  commitDate?: string
  author?: string
  buildTime: string
  buildTimeFormatted: string
  generatedAt: string
}
```

## 环境兼容性

工具类支持以下环境：

- **浏览器环境**: 从 `window.VERSION_INFO` 获取
- **Node.js环境**: 自动查找版本文件
- **ES模块环境**: 从 `globalThis.VERSION_INFO` 获取

## 错误处理

所有函数都有完善的错误处理：

- 当版本信息不可用时，返回 'unknown' 或 null
- 错误会在控制台输出警告信息
- 不会抛出异常，确保应用稳定运行

## TypeScript 支持

### 类型定义

插件提供了完整的TypeScript类型定义：

```typescript
// 版本信息接口
interface VersionInfo {
  version: string
  tag: string | null
  branch: string
  commitHash: string
  fullCommitHash: string
  commitDate?: string
  author?: string
  buildTime: string
  buildTimeFormatted: string
  generatedAt: string
  [key: string]: any
}

// 版本比较结果
type CompareResult = -1 | 0 | 1

// 打印选项
interface PrintOptions {
  detailed?: boolean
  styled?: boolean
}

// 徽章选项
interface BadgeOptions {
  style?: 'flat' | 'rounded'
  color?: string
}

// 时间格式化选项
interface FormatTimeOptions {
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  hour?: 'numeric' | '2-digit'
  minute?: 'numeric' | '2-digit'
  second?: 'numeric' | '2-digit'
  timeZone?: string
  hour12?: boolean
}
```

### TypeScript 使用示例

#### 基础使用
```typescript
import { getVersionInfo, type VersionInfo } from 'vite-plugin-generate-version/utils'

const versionInfo: VersionInfo | null = getVersionInfo()
if (versionInfo) {
  console.log(`版本: ${versionInfo.version}`)
}
```

#### React组件
```tsx
import React from 'react'
import { getVersionInfo, createVersionBadge, type VersionInfo } from 'vite-plugin-generate-version/utils'

interface VersionDisplayProps {
  showDetailed?: boolean
}

const VersionDisplay: React.FC<VersionDisplayProps> = ({ showDetailed = false }) => {
  const versionInfo: VersionInfo | null = getVersionInfo()
  
  if (!versionInfo) {
    return <div>版本信息不可用</div>
  }

  return (
    <div>
      <p>版本: {versionInfo.version}</p>
      <div dangerouslySetInnerHTML={{ 
        __html: createVersionBadge({ style: 'rounded', color: '#52c41a' }) 
      }} />
    </div>
  )
}
```

#### 自定义Hook
```typescript
import { useState, useEffect } from 'react'
import { getVersionInfo, type VersionInfo } from 'vite-plugin-generate-version/utils'

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
```

#### 类型守卫
```typescript
import type { VersionInfo } from 'vite-plugin-generate-version/utils'

function isValidVersionInfo(obj: any): obj is VersionInfo {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.version === 'string' &&
    typeof obj.branch === 'string' &&
    typeof obj.commitHash === 'string' &&
    typeof obj.buildTime === 'string'
}

// 使用类型守卫
const data: unknown = getVersionInfo()
if (isValidVersionInfo(data)) {
  // 这里 data 的类型是 VersionInfo
  console.log(data.version)
}
```

### 全局类型扩展

插件自动扩展了全局类型：

```typescript
// 这些类型会自动可用
declare global {
  interface Window {
    VERSION_INFO: VersionInfo
  }
  
  interface GlobalThis {
    VERSION_INFO: VersionInfo
  }
}

// 可以直接使用
const version = window.VERSION_INFO.version
```

## 使用建议

1. **优先使用工具类**: 相比直接访问 `window.VERSION_INFO`，工具类提供更好的错误处理和类型安全
2. **版本比较**: 使用 `compareVersions` 进行版本号比较，支持语义化版本
3. **时间显示**: 使用 `getBuildTimeAgo()` 提供更友好的时间显示
4. **调试信息**: 使用 `printVersionInfo({ detailed: true })` 输出完整的调试信息
5. **TypeScript项目**: 充分利用类型定义，获得更好的开发体验和类型安全
