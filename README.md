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
      injectScript: true
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

### JavaScript
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

const VersionDisplay: React.FC = () => {
  const version = window.VERSION_INFO

  return (
    <div className="version-info">
      <h3>版本信息</h3>
      <p>版本: {version.version}</p>
      <p>构建时间: {version.buildTimeFormatted}</p>
      <p>提交: {version.commitHash}</p>
    </div>
  )
}
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

### 2.0.0
- 🎉 重大重构升级
- ✨ 新增TypeScript类型定义支持
- 🔧 增强配置选项和灵活性
- 🛡️ 改进错误处理和边界情况处理
- ⚡ 优化性能，避免重复执行Git命令
- 📝 支持生成TypeScript版本文件
- 🎯 智能的HTML脚本注入
- 🌐 更好的多环境支持

### 1.0.0
- 🎉 初始版本发布
- ✨ 支持自动生成版本文件
- ✨ 支持自动注入版本脚本
- ✨ 支持多种配置选项