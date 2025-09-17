const generateVersion = require('../scripts/generate-version.js')

function generateVersionVitePlugin({ path, rule }) {
  return {
    name: 'vite-plugin-generate-version',
    enforce: 'pre', // 插件执行的阶段，可选 'pre' 或 'post'
    config(config, { command, mode }) {
      // 在这里可以修改配置
      return config
    },
    configResolved(resolvedConfig) {
      // 配置解析后，可以做一些额外的处理
    },
    buildStart() {
      // 构建开始时执行
      console.log('=========Build started!==========')
      generateVersion({ path, rule })
    },
    transformIndexHtml(html) {
      console.log('=========transformIndexHtml==========')

      // 在body结束标签前插入version.js脚本
      const versionScript = `<script src="/version.js?v=${Date.now()}"></script>`
      return html.replace('</body>', `${versionScript}\n</body>`)
    },
    transform(code, id) {
      // 转换代码，例如添加一些全局变量或者修改代码
      if (id.endsWith('.js')) {
        return code.replace('console.log', 'alert') // 示例：将console.log替换为alert
      }
      return null // 表示不处理该文件或返回null表示不变更原代码
    },
    async generateBundle(_, bundle) {
      // 生成bundle后执行，可以用来做最后的处理或优化
    },
    closeBundle() {
      // 关闭bundle时执行，可以做一些清理工作
    },
  }
}

module.exports = generateVersionVitePlugin
