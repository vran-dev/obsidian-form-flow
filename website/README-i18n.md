# Docusaurus 国际化配置完成

## 已完成的配置

### 1. 基础国际化配置 (docusaurus.config.ts)
- ✅ 配置支持英文 (`en`) 和简体中文 (`zh-CN`)
- ✅ 设置默认语言为英文
- ✅ 添加语言切换下拉菜单
- ✅ 更新导航栏和页脚内容

### 2. 翻译文件结构
```
i18n/zh-CN/
├── code.json                                    # 通用翻译
├── docusaurus-theme-classic/
│   ├── navbar.json                             # 导航栏翻译
│   └── footer.json                             # 页脚翻译
├── docusaurus-plugin-content-docs/
│   └── current.json                            # 文档插件翻译
└── docusaurus-plugin-content-blog/
    └── options.json                            # 博客插件翻译
```

### 3. 内容翻译
- ✅ 创建中文版本的介绍文档 (`intro.md`)
- ✅ 创建中文版本的博客文章示例
- ✅ 配置侧边栏翻译

### 4. 构建脚本
- ✅ `npm start` - 启动英文版本 (http://localhost:3000)
- ✅ `npm run start:zh` - 启动中文版本 (http://localhost:3001)
- ✅ `npm run build` - 构建所有语言版本
- ✅ `npm run build:zh` - 只构建中文版本

## 如何使用

### 开发模式
```bash
# 启动英文版本
cd website && npm start

# 启动中文版本  
cd website && npm run start:zh

# 在不同端口启动中文版本
cd website && npm run start:zh -- --port 3001
```

### 生产构建
```bash
# 构建所有语言版本
cd website && npm run build

# 构建特定语言
cd website && npm run build:zh
```

### 添加新的翻译内容

#### 添加新的中文文档
在 `i18n/zh-CN/docusaurus-plugin-content-docs/current/` 目录下创建对应的 `.md` 文件

#### 添加新的中文博客文章
在 `i18n/zh-CN/docusaurus-plugin-content-blog/` 目录下创建对应的 `.md` 文件

#### 生成翻译模板
```bash
# 生成中文翻译模板
cd website && npm run write-translations:zh
```

## 访问地址

- 英文版本: http://localhost:3000/obsidian-form-flow/
- 中文版本: http://localhost:3001/obsidian-form-flow/zh-CN/

## 语言切换

用户可以通过导航栏右上角的语言下拉菜单在英文和中文之间切换。所有的菜单项、页面标题、按钮文本等都会相应地切换到对应的语言版本。

## 注意事项

1. 每次添加新的页面或组件后，记得运行 `npm run write-translations:zh` 来更新翻译模板
2. 翻译文件使用 JSON 格式，确保语法正确
3. 中文内容应该放在对应的 `i18n/zh-CN/` 目录结构下
4. 构建时会同时构建所有语言版本，生成的静态文件会包含所有语言的内容

## 常见问题解答

### Q: 为什么 `npm start` 只能启用一个语言版本？

**A: 这是 Docusaurus 开发模式的工作机制：**

#### 开发模式的限制
- **性能优化**：为了加快开发服务器的启动速度和热重载性能，Docusaurus 在开发模式下默认只构建默认语言版本
- **单语言模式**：`npm start` 只启动默认语言（英文），`npm run start:zh` 只启动中文版本
- **这不影响最终用户体验**：这只是开发时的限制

#### 生产模式的完整体验
- **完整构建**：`npm run build` 会构建所有语言版本
- **语言切换**：在生产环境中，用户可以通过导航栏的语言切换菜单在不同语言间无缝切换
- **URL 结构**：
  - 英文版本: `https://your-site.com/`
  - 中文版本: `https://your-site.com/zh-CN/`

#### 开发时测试语言切换的方法

**方法1: 分别启动不同语言版本**
```bash
# 测试英文版本
npm start

# 测试中文版本（新终端窗口）
npm run start:zh -- --port 3001
```

**方法2: 构建并预览**
```bash
# 构建所有语言版本
npm run build

# 预览构建结果（支持完整的语言切换）
npm run serve
```

**方法3: 直接访问不同语言的URL**
- 开发时可以通过修改URL来测试：
  - 英文: `http://localhost:3000/obsidian-form-flow/`
  - 中文: `http://localhost:3000/obsidian-form-flow/zh-CN/` （需要先启动中文版本）

### Q: 语言切换菜单的作用是什么？

**A: 语言切换菜单在生产环境中完全可用：**

1. **生产环境功能**：在 `npm run build` 构建的网站中，用户可以点击语言切换菜单在英文和中文之间切换
2. **URL 路由**：切换语言会改变 URL 路径（添加或移除 `/zh-CN/`）
3. **状态保持**：用户选择的语言会被记住，刷新页面后仍保持所选语言
4. **SEO 友好**：每种语言都有独立的 URL，有利于搜索引擎优化

### Q: 如何在开发时完整测试国际化功能？

**A: 推荐的测试流程：**

```bash
# 1. 构建项目
npm run build

# 2. 启动预览服务器
npm run serve

# 3. 访问 http://localhost:3000/obsidian-form-flow/
# 4. 点击导航栏的语言切换菜单测试功能
```

这样您就能完整体验最终用户看到的国际化功能了。
