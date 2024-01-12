# philological-translation

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/0b452574-1ccd-6b6e-9d12-df14a5ba5e71.philological-translation.svg)](https://marketplace.visualstudio.com/items?itemName=0b452574-1ccd-6b6e-9d12-df14a5ba5e71.philological-translation)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/0b452574-1ccd-6b6e-9d12-df14a5ba5e71.philological-translation.svg)](https://marketplace.visualstudio.com/items?itemName=0b452574-1ccd-6b6e-9d12-df14a5ba5e71.philological-translation)

## 功能特性

philological-translation 是一款专为注解和翻译设计的VSCode插件。它允许用户对选中的代码片段进行注释并调用翻译服务进行翻译。

### 主要功能

- **Comment and Translate Selection**：选中代码后，通过命令面板或快捷键执行此操作，可以快速将选中文本添加注释并进行翻译。

### 配置选项

在VSCode设置中可自定义以下参数：
- **App ID** (`philologicalTranslation.appId`)：用于与翻译服务通信的应用ID，请从服务提供商处获取。
- **API Key** (`philologicalTranslation.apiKey`)：用于验证身份的API密钥。请注意保持安全，不要公开分享。

## 安装方法

1. 打开VSCode。
2. 点击左侧边栏的扩展图标（或者通过菜单 "查看" -> "扩展"）。
3. 在搜索框中输入 `philological-translation`。
4. 在搜索结果中找到本扩展，并点击 "安装" 按钮。

## 使用指南

- 要使用翻译功能，请首先确保已正确配置了 App ID 和 API Key。
- 选中需要注解和翻译的代码片段。
- 在命令面板（快捷键 `Ctrl+Shift+P` 或 `Cmd+Shift+P`）中输入并选择 "Comment and Translate Selection" 命令。

## 快捷键

- 若要查看如何为 "Comment and Translate Selection" 功能添加快捷键，请运行 "Show Keybinding Instruction for Comment and Translate" 命令。

## 更新日志

请参阅 [CHANGELOG.md](./CHANGELOG.md) 获取每个版本的主要更新内容和改进。

## 许可证

本项目采用 [MIT License](LICENSE) 开源许可协议。

---

有任何问题、建议或反馈，请提交至GitHub仓库的问题页面，或者联系开发者邮箱。感谢您的使用！