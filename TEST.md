# 测试 generate-version 功能

本文档介绍如何测试 `vite-plugin-generate-version` 的功能。

## 📋 测试命令

我们提供了多个测试命令来验证插件功能：

### 基本测试
```bash
# 运行默认测试（生成所有文件类型）
npm test

# 运行基本测试（仅生成 JSON 和 JS 文件）
npm run test:basic

# 运行完整测试（生成所有文件类型）
npm run test:full

# 运行最小测试（仅生成 JSON，不包含作者和提交日期）
npm run test:minimal

# 显示帮助信息
npm run test:help
```

### 直接使用测试脚本
```bash
# 使用默认配置
node test-generate-version.js

# 自定义输出目录和文件类型
node test-generate-version.js --path my-output --files json,ts

# 排除作者信息和提交日期
node test-generate-version.js --no-author --no-commit-date

# 使用 UTC 时区
node test-generate-version.js --timezone UTC

# 显示帮助
node test-generate-version.js --help
```

## 🔧 测试选项

| 选项 | 描述 | 默认值 |
|------|------|--------|
| `--path <dir>` | 输出目录 | `test-output` |
| `--files <types>` | 文件类型（逗号分隔） | `json,js,txt,ts` |
| `--no-author` | 不包含作者信息 | 包含 |
| `--no-commit-date` | 不包含提交日期 | 包含 |
| `--timezone <tz>` | 时区设置 | `Asia/Shanghai` |

## 📂 输出文件

测试会在指定目录中生成以下文件：

- `version.json` - JSON 格式的版本信息
- `version.js` - JavaScript 模块格式的版本信息
- `version.txt` - 人类可读的文本格式版本信息
- `version.ts` - TypeScript 模块格式的版本信息

## 🧪 示例测试

### 运行插件示例测试
```bash
# 运行插件配置示例
node example/test-example.js
```

这个示例展示了：
- 基本插件配置
- 完整插件配置
- 最小插件配置
- 插件生命周期模拟

## 📊 测试结果示例

运行测试后，你会看到类似以下的输出：

```
🚀 开始测试 generate-version 功能

📋 测试配置:
  输出目录: test-output
  文件类型: json, js, txt, ts
  包含作者: true
  包含提交日期: true
  时区: Asia/Shanghai

⚙️ 生成版本文件...
✅ 版本文件已生成: /path/to/test-output/version.json
✅ 版本文件已生成: /path/to/test-output/version.js
✅ 版本文件已生成: /path/to/test-output/version.txt
✅ 版本文件已生成: /path/to/test-output/version.ts

✅ 测试结果:
  ✅ JSON 文件 (1234 bytes)
  ✅ JS 文件 (2345 bytes)
  ✅ TXT 文件 (567 bytes)
  ✅ TS 文件 (3456 bytes)

📊 版本信息摘要:
  版本: main
  分支: main
  提交: abc1234
  标签: 无
  作者: machao
  提交时间: 2025-09-17T10:30:00+08:00
  构建时间: 2025-09-17 18:30:00

⏱️ 测试完成，耗时: 125ms
🎉 所有测试完成!
```

## 🐛 故障排除

### 常见问题

1. **不是 Git 仓库错误**
   - 确保在 Git 仓库中运行测试
   - 如果不在 Git 仓库中，会生成基础版本信息

2. **文件生成失败**
   - 检查输出目录权限
   - 确保目录路径有效

3. **Git 命令失败**
   - 确保系统安装了 Git
   - 检查 Git 仓库状态

### 调试模式

使用环境变量启用详细日志：

```bash
DEBUG=true npm test
```

## 🔄 清理测试文件

测试脚本会自动清理之前的输出文件。如需手动清理：

```bash
# 删除默认测试输出目录
rm -rf test-output

# 删除示例输出目录
rm -rf example/output-*
```
