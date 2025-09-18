# vite-plugin-generate-version

🚀 一个强大的Vite插件，自动基于Git仓库数据生成全面的版本信息文件，支持TypeScript

## ✨ 特性

- 🎯 **智能版本提取**: 从Git分支、标签、提交信息中自动提取版本信息
- 📝 **多格式输出**: 支持JSON、JavaScript、TypeScript、文本格式
- 🔧 **高度可配置**: 丰富的配置选项满足不同需求
- 🛡️ **TypeScript支持**: 完整的类型定义和智能提示
- 🚫 **错误容错**: 优雅处理非Git环境和各种边界情况
- ⚡ **性能优化**: 智能缓存和按需生成
- 🎨 **智能注入**: 自动将版本脚本注入到HTML中
- 🧰 **强大工具类**: 提供丰富的版本信息获取、比较和格式化工具
- 🔄 **版本比较**: 内置版本号比较和检查功能
- 🕒 **时间格式化**: 智能的构建时间格式化和相对时间显示
- 🎨 **可视化组件**: 支持生成版本徽章和美化显示

## 📦 安装

```bash
npm install vite-plugin-generate-version --save-dev
# 或
yarn add vite-plugin-generate-version -D
# 或
pnpm add vite-plugin-generate-version -D
```

## 🚀 基础用法

### JavaScript配置

```javascript
import { defineConfig } from 'vite'
import generateVersion from 'vite-plugin-generate-version'

export default defineConfig({
  plugins: [
    generateVersion({
      path: 'public',
      files: ['json', 'js', 'txt'],
      injectScript: true, // 是否注入环境
      generateOnDev: true, // 开发环境是否开启
    })
  ]
})
```

### TypeScript配置

```typescript
import { defineConfig } from 'vite'
import generateVersion, { type PluginOptions } from 'vite-plugin-generate-version'

const versionConfig: PluginOptions = {
  path: 'public',
  files: ['json', 'js', 'ts'],
  injectScript: true,
  customFields: {
    buildNumber: process.env.BUILD_NUMBER || '1',
    environment: process.env.NODE_ENV || 'development'
  }
}

export default defineConfig({
  plugins: [
    generateVersion(versionConfig)
  ]
})
```

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `path` | `string` | `'public'` | 版本文件输出目录 |
| `rule` | `RegExp` | `/.+-/` | 从分支名提取版本号的正则表达式 |
| `files` | `FileType[]` | `['json', 'js', 'txt']` | 要生成的文件类型 |
| `injectScript` | `boolean` | `true` | 是否自动注入version.js到HTML |
| `scriptPath` | `string` | `'/version.js'` | 注入脚本的路径 |
| `includeAuthor` | `boolean` | `true` | 是否包含提交者信息 |
| `includeCommitDate` | `boolean` | `true` | 是否包含提交日期 |
| `timeZone` | `string` | `'Asia/Shanghai'` | 时区设置 |
| `customFields` | `object` | `{}` | 自定义字段 |
| `generateOnDev` | `boolean` | `false` | 是否在开发模式下生成 |
| `cacheBuster` | `boolean` | `true` | 是否添加缓存破坏参数 |
| `silent` | `boolean` | `false` | 是否静默模式 |
| `logLevel` | `LogLevel` | `'info'` | 日志级别 |
| `enableTransform` | `boolean \| function` | `false` | 启用代码转换功能 |

## 📁 生成的文件

插件会根据配置生成以下文件：

### version.json
```json
{
  "version": "main",
  "tag": "v1.0.0",
  "branch": "main",
  "commitHash": "abc1234",
  "fullCommitHash": "abc1234567890...",
  "commitDate": "2023-12-01T10:00:00+08:00",
  "author": "开发者",
  "buildTime": "2023-12-01T10:30:00.000Z",
  "buildTimeFormatted": "2023/12/01 18:30:00"
}
```

### version.js
```javascript
// 支持多种模块系统
window.VERSION_INFO = { /* 版本信息 */ };
module.exports = { /* 版本信息 */ };
```

### version.ts (TypeScript)
```typescript
export interface VersionInfo {
  version: string;
  tag: string | null;
  // ...
}

export const VERSION_INFO: VersionInfo = { /* 版本信息 */ };
```

### version.txt
```
项目版本信息
=============
版本: main
版本标签: v1.0.0
分支: main
...
```

## 🎯 高级用法

### 自定义字段
```typescript
generateVersion({
  customFields: {
    buildNumber: process.env.CI_BUILD_NUMBER,
    deployTarget: process.env.DEPLOY_TARGET,
    buildType: process.env.NODE_ENV === 'production' ? 'release' : 'debug'
  }
})
```

### 代码转换
```typescript
generateVersion({
  enableTransform: (code, id) => {
    if (id.includes('debug')) {
      return code.replace(/console\.log/g, 'console.debug')
    }
    return null
  }
})
```

### 生产环境专用配置
```typescript
generateVersion({
  generateOnDev: false,  // 仅在构建时生成
  files: ['json', 'js'], // 减少文件数量
  silent: process.env.CI === 'true' // CI环境静默
})
```

## 🌐 在应用中使用

### 使用工具类（推荐）

插件提供了强大的工具类 `utils.js`，简化版本信息的获取和使用：

```javascript
// ES6 模块导入
import {
  getVersion,
  getBranch,
  getVersionSummary,
  printVersionInfo,
  compareVersions,
  isNewerThan,
  formatBuildTime,
  getBuildTimeAgo,
  createVersionBadge
} from 'vite-plugin-generate-version/utils.js'

// 或者默认导入
import getVersionInfo from 'vite-plugin-generate-version/utils.js'

// 基础信息获取
console.log('版本:', getVersion())           // "1.2.3"
console.log('分支:', getBranch())             // "main"
console.log('摘要:', getVersionSummary())     // "v1.2.3 main @abc1234"

// 版本比较
console.log(compareVersions('1.2.3', '1.2.4'))  // -1
console.log(isNewerThan('1.2.0'))               // true

// 时间格式化
console.log(formatBuildTime())     // "2025-09-18 14:30:25"
console.log(getBuildTimeAgo())     // "2小时前"

// 控制台打印（支持样式和详细模式）
printVersionInfo({ detailed: true, styled: true })

// 创建版本徽章
const badge = createVersionBadge({ style: 'rounded', color: 'green' })
document.getElementById('version').innerHTML = badge
```

### 工具类API参考

#### 基础信息获取
- `getVersionInfo()` - 获取完整版本信息对象
- `getVersion()` - 获取版本号
- `getTag()` - 获取Git标签
- `getBranch()` - 获取分支名
- `getCommitHash()` - 获取提交哈希（短）
- `getFullCommitHash()` - 获取完整提交哈希
- `getCommitDate()` - 获取提交时间
- `getAuthor()` - 获取提交者
- `getBuildTime()` - 获取构建时间（ISO格式）
- `getBuildTimeFormatted()` - 获取格式化的构建时间

#### 状态检查
- `isVersionInfoAvailable()` - 检查版本信息是否可用
- `getVersionSummary()` - 获取版本信息摘要

#### 版本比较
- `compareVersions(v1, v2)` - 比较两个版本号
- `isNewerThan(version)` - 检查是否比指定版本新
- `isOlderThan(version)` - 检查是否比指定版本旧

#### 时间格式化
- `formatBuildTime(locale, options)` - 自定义格式化构建时间
- `getBuildTimeAgo()` - 获取构建时间距离现在的时长

#### 显示功能
- `printVersionInfo(options)` - 打印版本信息到控制台
- `createVersionBadge(options)` - 创建版本信息徽章HTML

### 直接访问（传统方式）

```javascript
// 访问版本信息
console.log('当前版本:', window.VERSION_INFO.version)
console.log('构建时间:', window.VERSION_INFO.buildTimeFormatted)

// 或者通过模块导入
import versionInfo from '/version.js'
console.log(versionInfo)
```

### TypeScript
```typescript
import { VERSION_INFO, type VersionInfo } from '/version.ts'

// 类型安全的访问
const currentVersion: string = VERSION_INFO.version
const buildTime: string = VERSION_INFO.buildTime
```

### React示例
```tsx
import React from 'react'
import { 
  getVersion, 
  getBranch, 
  getBuildTimeFormatted, 
  getBuildTimeAgo,
  createVersionBadge 
} from 'vite-plugin-generate-version/utils.js'

const VersionDisplay: React.FC = () => {
  return (
    <div className="version-info">
      <h3>版本信息</h3>
      <p>版本: {getVersion()}</p>
      <p>分支: {getBranch()}</p>
      <p>构建时间: {getBuildTimeFormatted()} ({getBuildTimeAgo()})</p>
      <div dangerouslySetInnerHTML={{ 
        __html: createVersionBadge({ style: 'rounded', color: '#52c41a' }) 
      }} />
    </div>
  )
}
```

### Vue示例
```vue
<template>
  <div class="version-info">
    <h3>版本信息</h3>
    <p>版本: {{ version }}</p>
    <p>分支: {{ branch }}</p>
    <p>构建时间: {{ buildTime }} ({{ buildTimeAgo }})</p>
    <div v-html="versionBadge"></div>
  </div>
</template>

<script setup>
import { 
  getVersion, 
  getBranch, 
  getBuildTimeFormatted, 
  getBuildTimeAgo,
  createVersionBadge 
} from 'vite-plugin-generate-version/utils.js'

const version = getVersion()
const branch = getBranch()
const buildTime = getBuildTimeFormatted()
const buildTimeAgo = getBuildTimeAgo()
const versionBadge = createVersionBadge({ style: 'rounded', color: '#409eff' })
</script>
```

## 🔧 故障排除

### 非Git环境
插件会自动检测非Git环境并生成基础版本信息，不会中断构建流程。

### 性能优化
- 版本信息会被缓存，避免重复Git命令执行
- 可通过`generateOnDev: false`在开发环境跳过生成

### 调试模式
```typescript
generateVersion({
  logLevel: 'debug',
  silent: false
})
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [GitHub仓库](https://github.com/your-username/vite-plugin-generate-version)
- [NPM包](https://www.npmjs.com/package/vite-plugin-generate-version)
- [问题反馈](https://github.com/your-username/vite-plugin-generate-version/issues)

## 📋 更新日志

### 1.1.0
- 🧰 **新增强大工具类**: 提供完整的版本信息操作API
- 🔄 **版本比较功能**: 支持版本号比较和检查
- 🕒 **时间格式化增强**: 智能的相对时间显示（如"2小时前"）
- 🎨 **版本徽章生成**: 支持创建可定制的版本信息徽章
- 🗑️ **历史文件清理**: 支持生成前自动清理历史版本文件
- 🔧 **环境兼容性**: 增强浏览器和Node.js环境的兼容性
- 📚 **文档完善**: 新增详细的API文档和使用示例

### 1.0.0
- 🎉 初始版本发布
- ✨ 支持自动生成版本文件
- ✨ 支持自动注入版本脚本
- ✨ 支持多种配置选项