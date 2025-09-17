const { generateVersion, clearVersionFiles } = require('./lib/generate-version')

/**
 * 默认配置
 */
const DEFAULT_OPTIONS = {
  path: 'public',
  rule: /.+-/,
  injectScript: true,
  enableTransform: false,
  silent: false,
  files: ['json', 'js', 'txt'],
  scriptPath: '/version.js',
  includeAuthor: true,
  includeCommitDate: true,
  timeZone: 'Asia/Shanghai',
  customFields: {},
  generateOnDev: false,
  cacheBuster: true,
  logLevel: 'info',
}

/**
 * 验证插件配置
 * @param {Object} options - 配置选项
 * @returns {Object} 验证后的配置
 */
function validateOptions(options) {
  const validatedOptions = { ...DEFAULT_OPTIONS, ...options }

  // 验证路径
  if (typeof validatedOptions.path !== 'string') {
    throw new Error('配置错误: path 必须是字符串')
  }

  // 验证规则
  if (!(validatedOptions.rule instanceof RegExp)) {
    throw new Error('配置错误: rule 必须是正则表达式')
  }

  // 验证文件类型
  const validFileTypes = ['json', 'js', 'txt', 'ts']
  if (!Array.isArray(validatedOptions.files)) {
    throw new Error('配置错误: files 必须是数组')
  }

  validatedOptions.files.forEach((fileType) => {
    if (!validFileTypes.includes(fileType)) {
      throw new Error(`配置错误: 不支持的文件类型 "${fileType}"。支持的类型: ${validFileTypes.join(', ')}`)
    }
  })

  return validatedOptions
}

/**
 * 记录日志
 * @param {string} level - 日志级别
 * @param {string} message - 日志消息
 * @param {Object} options - 配置选项
 */
function log(level, message, options) {
  if (options.silent) return

  const logLevels = { error: 0, warn: 1, info: 2, debug: 3 }
  const currentLevel = logLevels[options.logLevel] || 2
  const messageLevel = logLevels[level] || 2

  if (messageLevel <= currentLevel) {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](message)
  }
}

/**
 * Vite插件：自动生成版本信息
 * @param {Object} options - 插件配置选项
 * @param {string} options.path - 版本文件输出目录，默认为 'public'
 * @param {RegExp} options.rule - 版本号规则，默认为 /.+-/
 * @param {boolean} options.injectScript - 是否自动注入version.js到HTML，默认为true
 * @param {boolean} options.enableTransform - 是否启用代码转换功能，默认为false
 * @param {boolean} options.silent - 是否静默模式，默认为false
 * @param {Array<string>} options.files - 要生成的文件类型，默认为 ['json', 'js', 'txt']
 * @param {string} options.scriptPath - 注入的脚本路径，默认为 '/version.js'
 * @param {boolean} options.includeAuthor - 是否包含作者信息，默认为true
 * @param {boolean} options.includeCommitDate - 是否包含提交日期，默认为true
 * @param {string} options.timeZone - 时区，默认为 'Asia/Shanghai'
 * @param {Object} options.customFields - 自定义字段
 * @param {boolean} options.generateOnDev - 是否在开发模式下生成，默认为false
 * @param {boolean} options.cacheBuster - 是否添加缓存破坏参数，默认为true
 * @param {string} options.logLevel - 日志级别，默认为 'info'
 * @returns {Object} Vite插件对象
 */
function generateVersionVitePlugin(options = {}) {
  let validatedOptions
  let versionInfo = null
  let isProduction = false

  try {
    validatedOptions = validateOptions(options)
  } catch (error) {
    throw new Error(`vite-plugin-generate-version: ${error.message}`)
  }

  /**
   * 生成版本信息的核心函数
   */
  async function generateVersionInfo() {
    if (versionInfo) {
      return versionInfo // 使用缓存的版本信息
    }

    try {
      const generateOptions = {
        includeAuthor: validatedOptions.includeAuthor,
        includeCommitDate: validatedOptions.includeCommitDate,
        customFields: validatedOptions.customFields,
        timeZone: validatedOptions.timeZone,
        files: validatedOptions.files,
      }

      versionInfo = await generateVersion(validatedOptions.path, validatedOptions.rule, generateOptions)

      log('info', `版本信息生成成功: ${versionInfo.version}`, validatedOptions)
      return versionInfo
    } catch (error) {
      log('error', `生成版本文件失败: ${error.message}`, validatedOptions)
      throw error
    }
  }

  return {
    name: 'vite-plugin-generate-version',
    enforce: 'pre',

    config(config, { command, mode }) {
      isProduction = command === 'build'
      log('debug', `插件初始化 - 模式: ${mode}, 命令: ${command}`, validatedOptions)
      return config
    },

    configResolved(resolvedConfig) {
      log('debug', `配置解析完成 - 生产模式: ${isProduction}`, validatedOptions)
    },

    async buildStart() {
      // 只在生产构建或明确启用开发模式生成时才生成版本文件
      if (isProduction || validatedOptions.generateOnDev) {
        try {
          await generateVersionInfo()
        } catch (error) {
          if (!validatedOptions.silent) {
            this.warn(`版本文件生成失败: ${error.message}`)
          }
        }
      } else {
        // 清除历史版本文件
        clearVersionFiles()
      }
    },

    transformIndexHtml: {
      enforce: 'post',
      transform(html, context) {
        // 如果启用了脚本注入，在body结束标签前插入version.js脚本
        if (
          validatedOptions.injectScript &&
          validatedOptions.files.includes('js') &&
          (isProduction || validatedOptions.generateOnDev)
        ) {
          const cacheBuster = validatedOptions.cacheBuster ? `?v=${Date.now()}` : ''
          const versionScript = `<script src="${validatedOptions.scriptPath}${cacheBuster}" defer></script>`

          // 脚本注入
          if (html.includes('</body>')) {
            return html.replace('</body>', `  ${versionScript}\n</body>`)
          } else if (html.includes('</html>')) {
            return html.replace('</html>', `  ${versionScript}\n</html>`)
          } else {
            return html + `\n${versionScript}`
          }
        }
        return html
      },
    },

    async generateBundle(options, bundle) {
      // 在bundle生成后可以进行额外的处理
      if (isProduction && versionInfo) {
        log('info', `构建完成 - 版本: ${versionInfo.version}`, validatedOptions)

        // 可以在这里添加版本信息到bundle的manifest中
        if (options.manifest) {
          // 将版本信息添加到manifest
        }
      }
    },

    closeBundle() {
      // 清理工作
      log('debug', '插件清理完成', validatedOptions)
    },

    // 提供给外部使用的方法
    getVersionInfo() {
      return versionInfo
    },
  }
}

module.exports = generateVersionVitePlugin
module.exports.default = generateVersionVitePlugin
