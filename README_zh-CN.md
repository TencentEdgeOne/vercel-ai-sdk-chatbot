# VERCEL AI SDK 聊天机器人模板 - EdgeOne Pages

一个使用 Next.js 14、Vercel AI SDK 和 Tailwind CSS 构建的现代 AI 聊天机器人模板，专为在 EdgeOne Pages 上部署而设计。此模板提供了一个完整的 AI 聊天界面，支持多个 AI 提供商和模型。

## 这是什么模板？

这个模板是一个生产就绪的 AI 聊天机器人应用，您可以一键直接部署到 EdgeOne Pages。它具有以下特点：

- **多提供商支持**：适用于 DeepSeek、OpenAI、Anthropic、Google 和 xAI 模型
- **现代化 UI**：深色主题设计，具有流畅的动画和响应式布局
- **实时流式**：带有打字效果的实时 AI 响应
- **错误处理**：全面的错误处理和重试机制
- **EdgeOne 优化**：专为 EdgeOne Pages 部署而配置

## 部署

[![部署到 EdgeOne](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=https%3A%2F%2Fgithub.com%2Ftomcomtang%2Fvercel-ai-sdk-chatbot&output-directory=.next&build-command=npm+run+build&install-command=npm+install)

点击上方按钮直接将此模板部署到 EdgeOne Pages。部署将自动配置构建设置并安装依赖项。

## ✨ 功能特性

- 🤖 **多 AI 支持**：DeepSeek、OpenAI GPT、Anthropic Claude、Google Gemini、xAI Grok
- 🎨 **现代化 UI**：带有 SVG 背景和流畅动画的深色主题
- ⚡ **实时流式**：带有打字机效果的实时 AI 响应
- 📱 **响应式设计**：在桌面、平板和移动设备上完美运行
- 🎭 **流畅动画**：页面过渡、加载状态和交互效果
- 🔧 **可配置**：轻松切换模型和参数调整
- 🛡️ **强大的错误处理**：全面的错误消息和重试功能
- 🌐 **EdgeOne 优化**：专为 EdgeOne Pages 部署而构建

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/tomcomtang/vercel-ai-sdk-chatbot.git
cd vercel-ai-sdk-chatbot
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件并添加您的 API 密钥：

```env
# DeepSeek API 密钥（默认模型必需）
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 可选：其他 AI 提供商密钥
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
XAI_API_KEY=your_xai_api_key_here
```

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🛠️ 技术栈

- **框架**：Next.js 14（App Router）
- **AI SDK**：Vercel AI SDK v5
- **AI 模型**：DeepSeek、OpenAI GPT、Anthropic Claude、Google Gemini、xAI Grok
- **样式**：Tailwind CSS
- **图标**：Lucide React
- **语言**：TypeScript
- **部署**：EdgeOne Pages

## 📁 项目结构

```
vercel-ai-sdk-chatbot/
├── app/
│   ├── api/chat/route.ts    # AI 聊天 API 路由
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── components/
│   ├── ChatInput.tsx        # 聊天输入组件
│   ├── HomeScreen.tsx       # 主屏幕组件
│   ├── MessageList.tsx     # 消息列表组件
│   ├── ModelSelector.tsx    # 模型选择组件
│   └── ErrorMessage.tsx     # 错误消息组件
├── hooks/
│   ├── useChatLogic.ts      # 聊天逻辑钩子
│   └── useScrollLogic.ts    # 滚动逻辑钩子
├── functions/
│   └── api/chat/index.js    # EdgeOne Pages Action
├── env.example              # 环境变量示例
├── EDGEONE_SETUP.md         # EdgeOne 部署指南
├── package.json             # 项目配置
└── README.md                # 项目文档
```

## ⚙️ 配置选项

### 环境变量

| 变量名称                         | 必需 | 默认值 | 描述            |
| -------------------------------- | ---- | ------ | --------------- |
| `DEEPSEEK_API_KEY`               | ✅   | -      | DeepSeek API 密钥  |
| `OPENAI_API_KEY`                 | ❌   | -      | OpenAI API 密钥    |
| `ANTHROPIC_API_KEY`              | ❌   | -      | Anthropic API 密钥 |
| `GOOGLE_GENERATIVE_AI_API_KEY`   | ❌   | -      | Google AI API 密钥 |
| `XAI_API_KEY`                    | ❌   | -      | xAI API 密钥       |

### 支持的模型

- **DeepSeek**：`deepseek-chat`、`deepseek-reasoner`
- **OpenAI**：`gpt-4o-mini`
- **Anthropic**：`claude-3-5-sonnet-latest`
- **Google**：`gemini-2.0-flash`
- **xAI**：`grok-3`

## 🎨 自定义

### 修改 AI 行为

在 `app/api/chat/route.ts` 中编辑 `system` 提示：

```typescript
system: `您是一个智能 AI 助手，致力于帮助用户。请遵循以下原则：
1. 提供准确、有用和简洁的答案
2. 保持友好和专业的语气
3. 对不确定的答案保持诚实
4. 支持中文和英文交流
5. 提供实用的建议和解决方案`;
```

### 调整 AI 参数

```typescript
const result = await streamText({
  model: providerConfig.provider(selectedModel),
  messages: convertToModelMessages(uiMessages),
  maxOutputTokens: 1000, // 最大输出令牌数
  temperature: 0.7, // 创造性（0-1）
  // ... 其他参数
});
```

### 自定义样式

项目使用 Tailwind CSS，您可以：

1. 在 `app/globals.css` 中修改全局样式
2. 在各个组件文件中更新组件样式
3. 自定义配色方案和动画

## 🚀 部署

### EdgeOne Pages 部署（推荐）

1. 点击上方"部署到 EdgeOne"按钮
2. 在 EdgeOne 控制台中配置环境变量
3. 自动部署

### 手动部署

1. 将代码推送到 GitHub
2. 将您的 GitHub 仓库连接到 EdgeOne Pages
3. 在 EdgeOne 仪表板中配置环境变量
4. 自动部署

### 其他部署选项

- **Vercel**：支持带 API 路由的 Next.js
- **Netlify**：支持 Next.js 静态导出
- **Railway**：全栈部署

## 📝 许可证

本项目采用 **MIT 许可证**。

## 🤝 贡献

1. Fork 项目
2. 创建您的功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交您的更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 打开一个 Pull Request

## 📞 支持

如果您遇到任何问题或有疑问，请：

1. 查看 [Issues](https://github.com/tomcomtang/vercel-ai-sdk-chatbot/issues) 页面
2. 创建一个新的 issue 并提供详细描述
3. 联系维护者

## 🙏 致谢

- [Vercel AI SDK](https://sdk.vercel.ai/) 提供出色的 AI 集成工具
- [Next.js](https://nextjs.org/) 提供强大的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) 提供实用优先的 CSS 框架
- [EdgeOne Pages](https://pages.edgeone.ai/) 提供云边一体的部署平台

---

由 [tomcomtang](https://github.com/tomcomtang) 用 ❤️ 制作
