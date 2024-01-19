# philological-translation

## 功能特性

philological-translation 是一款专为注解和翻译设计的VSCode插件。它允许用户对选中的代码片段进行注释并调用翻译服务进行翻译。

### 主要功能

- **Comment and Translate Selection**：选中代码后，通过命令面板或快捷键执行此操作，可以快速将选中文本添加注释并进行翻译。
- **Comment and Translate Selection Hump**：选中代码后，通过命令面板或快捷键执行此操作，可以快速将选中文本添加注释并进行翻译成驼峰写法。

### 获取百度翻译API的App ID和API Key

#### 1. 注册百度开发者账号

要使用百度翻译API，首先需要在百度开放平台注册一个开发者账号。访问 [百度AI开放平台](https://ai.baidu.com/) 并完成以下步骤：

- 点击顶部导航栏中的“立即注册”，按照提示填写邮箱、手机号码等信息进行注册。
- 完成邮箱验证或手机短信验证。

#### 2. 创建应用并获取App ID和API Key

注册成功后，您需要创建一个新的应用来获得API密钥：

- 登录到您的百度开发者中心。
- 导航至相关服务管理页面，例如：【我的应用】或直接访问[百度翻译开放平台](https://fanyi-api.baidu.com/）。
- 点击【创建应用】按钮，填写应用名称、描述以及选择应用类型（如Web应用）。
- 提交后，系统会自动分配一个唯一的App ID给你的应用。
- 在应用详情页面中，找到API Key（可能被称为“密钥”、“秘钥”或“Access Key”），请妥善保存这个密钥，因为后续调用API时需要用到。

### 注意事项：

- App ID和API Key是敏感信息，请勿公开分享或泄露。
- 百度翻译API可能有免费试用额度与付费使用模式，请根据需求合理规划使用。
- 使用API前，请确保已阅读并遵守百度翻译API的服务条款和使用指南。

### 配置选项

在VSCode设置中可自定义以下参数：
- **App ID** (`philologicalTranslation.appId`)：用于与翻译服务通信的应用ID，请从服务提供商处获取。
- **API Key** (`philologicalTranslation.apiKey`)：用于验证身份的API密钥。请注意保持安全，不要公开分享。

```
  {
    "philologicalTranslation.appId": "百度翻译appId",
    "philologicalTranslation.apiKey": "百度翻译apiKey"
  }
```

## 安装方法

1. 打开VSCode。
2. 点击左侧边栏的扩展图标（或者通过菜单 "查看" -> "扩展"）。
3. 在搜索框中输入 `philological-translation`。
4. 在搜索结果中找到本扩展，并点击 "安装" 按钮。

## 使用指南

- 要使用翻译功能，请首先确保已正确配置了 App ID 和 API Key。
- 选中需要注解和翻译的代码片段。
- 在命令面板（快捷键 `Ctrl+Shift+P` 或 `Cmd+Shift+P`）中输入并选择 "Comment and Translate Selection（ctrl+m）" || "Comment and Translate Selection Hump（ctrl+alt+m）" 命令。

## 快捷键

- Comment and Translate Selection（ctrl+m）中英互译
- Comment and Translate Selection Hump（ctrl+alt+m）中英互译驼峰写法

// ## 更新日志

请参阅 [CHANGELOG.md](./CHANGELOG.md) 获取每个版本的主要更新内容和改进。

## 许可证

本项目采用 [MIT License](LICENSE) 开源许可协议。

---

有任何问题、建议或反馈，请提交至GitHub仓库的问题页面，或者联系开发者邮箱。感谢您的使用！