import { defineConfig } from 'vite'
import generateVersion from '../index.js'

export default defineConfig({
  plugins: [
    // 基础配置
    generateVersion({
      path: 'public',
      files: ['json', 'js', 'ts'],
      injectScript: true,
      customFields: {
        buildNumber: process.env.BUILD_NUMBER || '1',
        environment: process.env.NODE_ENV || 'development',
        buildBy: 'Vite Plugin Generate Version 2.0',
      },
      // 性能优化配置
      generateOnDev: false,
      silent: process.env.CI === 'true',
      logLevel: 'info',
      timeZone: 'Asia/Shanghai',
    }),
  ],
  build: {
    outDir: 'dist',
  },
})
