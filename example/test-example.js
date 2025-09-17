/**
 * 测试示例：使用不同配置测试 vite-plugin-generate-version
 */

const generateVersionPlugin = require('../index.js')

// 示例1：基本配置
console.log('🚀 示例1：基本配置')
const basicPlugin = generateVersionPlugin({
  path: 'example/output-basic',
  files: ['json', 'js'],
  injectScript: false,
  silent: false,
})

console.log('插件名称:', basicPlugin.name)
console.log('插件配置完成')
console.log()

// 示例2：完整配置
console.log('🚀 示例2：完整配置')
const fullPlugin = generateVersionPlugin({
  path: 'example/output-full',
  rule: /feature\//, // 匹配 feature/ 前缀
  files: ['json', 'js', 'txt', 'ts'],
  injectScript: true,
  scriptPath: '/assets/version.js',
  includeAuthor: true,
  includeCommitDate: true,
  timeZone: 'Asia/Shanghai',
  customFields: {
    appName: 'Test App',
    buildNumber: process.env.BUILD_NUMBER || '1',
    environment: process.env.NODE_ENV || 'development',
  },
  generateOnDev: true,
  cacheBuster: true,
  logLevel: 'info',
})

console.log('插件名称:', fullPlugin.name)
console.log('插件配置完成')
console.log()

// 示例3：最小配置
console.log('🚀 示例3：最小配置')
const minimalPlugin = generateVersionPlugin({
  path: 'example/output-minimal',
  files: ['json'],
  includeAuthor: false,
  includeCommitDate: false,
  silent: true,
})

console.log('插件名称:', minimalPlugin.name)
console.log('插件配置完成')
console.log()

// 模拟插件生命周期
async function simulatePluginLifecycle() {
  console.log('🔄 模拟插件生命周期...')

  try {
    // 模拟 config 阶段
    const config = {}
    const configContext = { command: 'build', mode: 'production' }

    console.log('1. 配置阶段...')
    if (fullPlugin.config) {
      fullPlugin.config(config, configContext)
    }

    // 模拟 configResolved 阶段
    console.log('2. 配置解析阶段...')
    if (fullPlugin.configResolved) {
      fullPlugin.configResolved({ command: 'build' })
    }

    // 模拟 buildStart 阶段
    console.log('3. 构建开始阶段...')
    if (fullPlugin.buildStart) {
      await fullPlugin.buildStart.call({
        warn: (msg) => console.warn('⚠️', msg),
      })
    }

    // 获取版本信息
    console.log('4. 获取版本信息...')
    if (fullPlugin.getVersionInfo) {
      const versionInfo = fullPlugin.getVersionInfo()
      if (versionInfo) {
        console.log('✅ 版本信息:', {
          version: versionInfo.version,
          branch: versionInfo.branch,
          commitHash: versionInfo.commitHash,
        })
      } else {
        console.log('ℹ️ 版本信息尚未生成')
      }
    }

    console.log('🎉 插件生命周期模拟完成')
  } catch (error) {
    console.error('❌ 插件生命周期模拟失败:', error.message)
  }
}

// 运行模拟
if (require.main === module) {
  simulatePluginLifecycle()
}

module.exports = {
  basicPlugin,
  fullPlugin,
  minimalPlugin,
  simulatePluginLifecycle,
}
