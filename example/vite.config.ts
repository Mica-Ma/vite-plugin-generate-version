import { defineConfig } from 'vite'
import generateVersion, { type PluginOptions } from '../index.js'

// TypeScript配置示例
const versionConfig: PluginOptions = {
  path: 'public',
  files: ['json', 'js', 'ts'],
  injectScript: true,
  customFields: {
    buildNumber: process.env.BUILD_NUMBER || '1',
    environment: process.env.NODE_ENV || 'development',
    buildBy: 'Vite Plugin Generate Version 2.0',
    commitAuthor: process.env.GIT_AUTHOR_NAME || 'unknown',
  },
  // 高级配置
  includeAuthor: true,
  includeCommitDate: true,
  timeZone: 'Asia/Shanghai',
  generateOnDev: false,
  cacheBuster: true,
  silent: process.env.CI === 'true',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  // 自定义代码转换
  enableTransform: (code, id) => {
    // 在开发环境下替换console.log为console.debug
    if (process.env.NODE_ENV === 'development' && id.includes('.js')) {
      return code.replace(/console\.log/g, 'console.debug')
    }
    return null
  },
}

export default defineConfig({
  plugins: [generateVersion(versionConfig)],
  build: {
    outDir: 'dist',
    manifest: true,
  },
})
