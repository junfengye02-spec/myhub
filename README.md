# yven Personal Atelier

一个 Astro 个人主页。当前结构围绕 3 个已上线项目展开：Titan APS、MES 制造执行系统、Sub2API，用真实截图、访问入口和项目详情呈现个人工程能力。

## 本地运行

```bash
npm run dev
```

默认监听 `0.0.0.0:5173`，本机访问 `http://localhost:5173`。如果要换端口：

```bash
PORT=8080 npm run dev
```

如果你想一键构建、重载 Nginx 并打开线上主页，直接双击项目根目录里的 `start-yven-site.command`。

## 构建

```bash
npm run build
```

构建产物会生成到 `dist/`，适合交给 Nginx、Caddy、静态托管平台或对象存储部署。

本地预览生产构建：

```bash
npm run preview
```

## 修改位置

- 作品展示信息：`src/data/projects.ts`
- 个人主页文案：`src/data/siteContent.ts`
- 首页：`src/pages/index.astro`
- 作品集页面：`src/pages/projects/index.astro`
- 作品详情页模板：`src/pages/projects/[slug].astro`
- 全局视觉：`src/styles/global.css`
- 交互脚本：`src/scripts/site.ts`
- SEO 布局：`src/layouts/BaseLayout.astro`

## 内容维护入口

主页内容集中在 `src/data/siteContent.ts`：

- `brand.mark` / `brand.name`：你的缩写和姓名
- `pages.home.description`：搜索引擎里的个人页简介
- `hero.eyebrow` / `hero.title` / `hero.summary`：首页首屏定位
- `facts`：首页四个关键数字或标签
- `focus.cards`：你希望页面强调的 3 个方向
- `workflow.items`：主页里展示的个人做事方式
- `sections.contact`：联系入口和可复制信息
- `sections.contact.summary`：联系方式或合作说明

项目内容集中在 `src/data/projects.ts`。作品卡片、详情页、筛选分类和外链都由这个文件驱动。

- `title`：作品标题
- `summary`：卡片简介
- `description`：详情页长介绍
- `caseStudy`：我的角色、核心模块、技术难点和上线结果
- `highlights`：适合放进个人主页的项目信号或真实观察
- `screenshots`：详情页截图，图片放在 `public/project-shots/`；第一张会同时作为作品卡片缩略图
- `access`：访问状态，比如“需登录查看内页”或“公开首页”
- `stack`：标签
- `links`：详情页按钮；`external: true` 表示打开新标签
- `featured: true`：进入首页精选区

列表顺序就是作品库展示顺序。建议作品保持真实截图、访问状态和清晰角色说明，这样个人主页会更有可信度。

## 文件

- `astro.config.mjs`：Astro 配置和 sitemap 集成。
- `package.json`：开发、构建和预览脚本。
- `public/`：favicon 和 OG 图。
- `src/`：页面、组件、数据和样式源码。

## 部署域名

正式部署建议：

1. `npm run build`
2. 用 Nginx/Caddy 指向 `dist/`
3. 域名 A 记录解析到服务器公网 IP
4. 开启 HTTPS

如果只是临时演示，也可以让反向代理转发到 `http://127.0.0.1:5173`。
