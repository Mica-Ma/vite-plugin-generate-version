#!/usr/bin/env node

/**
 * 测试 generate-version 功能的独立脚本
 * 用法: node test-generate-version.js [options]
 */

const path = require('path')
const fs = require('fs')
const generateVersion = require('./lib/generate-version')

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    path: 'public',
    rule: /.+-/,
    files: ['json', 'js', 'txt', 'ts'],
    includeAuthor: true,
    includeCommitDate: true,
    timeZone: 'Asia/Shanghai',
    customFields: {
      testRun: true,
      environment: process.env.NODE_ENV || 'test',
      nodeVersion: process.version,
    },
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--path':
        options.path = args[++i]
        break
      case '--files':
        options.files = args[++i].split(',')
        break
      case '--no-author':
        options.includeAuthor = false
        break
      case '--no-commit-date':
        options.includeCommitDate = false
        break
      case '--timezone':
        options.timeZone = args[++i]
        break
      case '--help':
      case '-h':
        showHelp()
        process.exit(0)
        break
    }
  }

  return options
}

function showHelp() {
  colorLog('cyan', '🧪 generate-version 测试工具')
  console.log()
  colorLog('yellow', '用法:')
  console.log('  node test-generate-version.js [options]')
  console.log()
  colorLog('yellow', '选项:')
  console.log('  --path <dir>           输出目录 (默认: test-output)')
  console.log('  --files <types>        文件类型，逗号分隔 (默认: json,js,txt,ts)')
  console.log('  --no-author           不包含作者信息')
  console.log('  --no-commit-date      不包含提交日期')
  console.log('  --timezone <tz>       时区 (默认: Asia/Shanghai)')
  console.log('  --help, -h            显示帮助信息')
  console.log()
  colorLog('yellow', '示例:')
  console.log('  node test-generate-version.js')
  console.log('  node test-generate-version.js --path dist --files json,ts')
  console.log('  node test-generate-version.js --no-author --timezone UTC')
}

// 清理测试输出目录
function cleanTestOutput(outputPath) {
  if (fs.existsSync(outputPath)) {
    colorLog('yellow', `🧹 清理输出目录: ${outputPath}`)
    fs.rmSync(outputPath, { recursive: true, force: true })
  }
}

// 显示生成的文件内容
function showGeneratedFiles(outputPath, files) {
  colorLog('cyan', '\n📄 生成的文件内容:')

  files.forEach((fileType) => {
    const filePath = path.join(outputPath, `version.${fileType}`)
    if (fs.existsSync(filePath)) {
      console.log()
      colorLog('blue', `📁 ${filePath}:`)
      console.log('─'.repeat(50))

      const content = fs.readFileSync(filePath, 'utf8')
      if (fileType === 'json') {
        // 美化JSON输出
        try {
          const jsonContent = JSON.parse(content)
          console.log(JSON.stringify(jsonContent, null, 2))
        } catch {
          console.log(content)
        }
      } else {
        // 限制其他文件的输出长度
        const lines = content.split('\n')
        if (lines.length > 20) {
          console.log(lines.slice(0, 15).join('\n'))
          colorLog('yellow', `... (省略 ${lines.length - 15} 行)`)
          console.log(lines.slice(-5).join('\n'))
        } else {
          console.log(content)
        }
      }
      console.log('─'.repeat(50))
    }
  })
}

// 运行测试
async function runTest() {
  const startTime = Date.now()

  colorLog('bright', '🚀 开始测试 generate-version 功能')
  console.log()

  try {
    // 解析参数
    const options = parseArgs()

    colorLog('blue', '📋 测试配置:')
    console.log(`  输出目录: ${options.path}`)
    console.log(`  文件类型: ${options.files.join(', ')}`)
    console.log(`  包含作者: ${options.includeAuthor}`)
    console.log(`  包含提交日期: ${options.includeCommitDate}`)
    console.log(`  时区: ${options.timeZone}`)
    console.log()

    // 清理输出目录
    cleanTestOutput(options.path)

    // 生成版本信息
    colorLog('yellow', '⚙️ 生成版本文件...')
    const versionInfo = generateVersion(options.path, options.rule, options)

    // 验证生成的文件
    const outputDir = path.resolve(process.cwd(), options.path)
    const generatedFiles = []

    options.files.forEach((fileType) => {
      const filePath = path.join(outputDir, `version.${fileType}`)
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        generatedFiles.push({
          type: fileType,
          path: filePath,
          size: stats.size,
          exists: true,
        })
      } else {
        generatedFiles.push({
          type: fileType,
          path: filePath,
          size: 0,
          exists: false,
        })
      }
    })

    // 显示测试结果
    console.log()
    colorLog('green', '✅ 测试结果:')

    generatedFiles.forEach((file) => {
      const status = file.exists ? '✅' : '❌'
      const size = file.exists ? `(${file.size} bytes)` : '(不存在)'
      console.log(`  ${status} ${file.type.toUpperCase()} 文件 ${size}`)
    })

    console.log()
    colorLog('cyan', '📊 版本信息摘要:')
    console.log(`  版本: ${versionInfo.version || '未知'}`)
    console.log(`  分支: ${versionInfo.branch || '未知'}`)
    console.log(`  提交: ${versionInfo.commitHash || '未知'}`)
    console.log(`  标签: ${versionInfo.tag || '无'}`)
    if (versionInfo.author) console.log(`  作者: ${versionInfo.author}`)
    if (versionInfo.commitDate) console.log(`  提交时间: ${versionInfo.commitDate}`)
    console.log(`  构建时间: ${versionInfo.buildTimeFormatted}`)

    // 显示生成的文件内容
    showGeneratedFiles(options.path, options.files)

    // 性能统计
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log()
    colorLog('magenta', `⏱️ 测试完成，耗时: ${duration}ms`)

    // 缓存状态检查
    const cacheStatus = generateVersion.getCacheStatus()
    if (cacheStatus.cached) {
      colorLog('blue', `💾 缓存状态: 已缓存 (${cacheStatus.age}ms 前)`)
    }

    colorLog('green', '\n🎉 所有测试完成!')
  } catch (error) {
    colorLog('red', `❌ 测试失败: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  }
}

// 主函数
if (require.main === module) {
  runTest()
}

module.exports = {
  runTest,
  parseArgs,
  showHelp,
}
