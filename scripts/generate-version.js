#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/**
 * 获取Git版本信息并生成版本文件
 */
function generateVersionFile(path = 'public', rule = /.+-/) {
  try {
    // 获取当前分支名
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()

    // 获取最新的commit hash (短格式)
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()

    // 获取最新的commit hash (完整格式)
    const fullCommitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()

    // 获取最新的tag (如果存在)
    let tag = ''
    try {
      tag = execSync('git describe --tags --exact-match HEAD', { encoding: 'utf8' }).trim()
    } catch (error) {
      // 如果当前commit没有tag，默认版本
      tag = ''
    }

    // 获取提交时间
    const commitDate = execSync('git log -1 --format=%cd --date=iso', { encoding: 'utf8' }).trim()

    // 获取提交者信息
    const author = execSync('git log -1 --format=%an', { encoding: 'utf8' }).trim()

    // 生成构建时间
    const buildTime = new Date().toISOString()

    const version = branch.replace(rule, '')

    // 创建版本信息对象
    const versionInfo = {
      tag: tag,
      version: version,
      branch: branch,
      commitHash: commitHash,
      fullCommitHash: fullCommitHash,
      commitDate: commitDate,
      author: author,
      buildTime: buildTime,
      generatedAt: buildTime,
    }

    // 定义输出文件路径
    const outputFiles = [
      {
        path: path.join(process.cwd(), `${path}/version.json`),
        content: JSON.stringify(versionInfo, null, 2),
      },
      {
        path: path.join(process.cwd(), `${path}/version.js`),
        content: `// 自动生成的版本信息文件 - 请勿手动修改
window.VERSION_INFO = ${JSON.stringify(versionInfo, null, 2)};

// 导出版本信息
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${JSON.stringify(versionInfo, null, 2)};
}
`,
      },
      {
        path: path.join(process.cwd(), `${path}/version.txt`),
        content: `项目版本信息
=============
版本: ${version}
版本标签: ${tag}
分支: ${branch}
提交哈希: ${commitHash}
完整哈希: ${fullCommitHash}
提交时间: ${commitDate}
提交者: ${author}
生成时间: ${buildTime}
`,
      },
    ]

    // 写入文件
    outputFiles.forEach((file) => {
      fs.writeFileSync(file.path, file.content, 'utf8')
      console.log(`✅ 版本文件已生成: ${file.path}`)
    })

    console.log('🎉 版本信息文件生成完成！')
    console.log(`📦 版本: ${version}`)
    console.log(`🏷️  标签: ${tag}`)
    console.log(`🌿 分支: ${branch}`)
    console.log(`📝 提交: ${commitHash}`)
  } catch (error) {
    console.error('❌ 生成版本文件时出错:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此脚本则执行生成函数
if (require.main === module) {
  generateVersionFile()
}

module.exports = generateVersionFile
