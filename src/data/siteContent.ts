// 把个人主页里最容易改的内容集中在这里。
// 你以后只要改这个文件，就能覆盖首页、页眉页脚和联系信息的大部分文案。

export const siteContent = {
  brand: {
    mark: "yven",
    name: "yven",
    homeLabel: "个人主页",
    galleryLabel: "项目作品",
  },
  pages: {
    home: {
      title: "yven | 个人主页",
      description: "yven 的个人主页，展示工业排程、制造执行系统、AI API 网关和全栈工程能力。",
    },
    projects: {
      title: "yven | 项目作品",
      description: "yven 的项目作品集：Titan APS、MES 制造执行系统和 Sub2API。",
    },
  },
  nav: {
    focus: "能力",
    projects: "项目",
    contact: "联系",
  },
  hero: {
    eyebrow: "yven / Full-stack Systems Builder",
    title: ["把复杂业务，", "做成能上线的系统。"],
    summary:
      "我关注工业系统和 AI 工具链：从制造排程、车间执行到多模型 API 网关，把业务模型、前后端工程、可视化和上线部署串成完整作品。",
    signalLabel: "现在聚焦",
    typeWords: ["工业排程系统", "制造执行 MES", "AI API 网关", "从业务建模到上线"],
    actions: {
      primary: "查看项目作品",
      secondary: "打开导航",
    },
    console: [
      { label: "Live", value: "3 Systems" },
      { label: "Domain", value: "APS / MES" },
      { label: "AI", value: "Gateway" },
      { label: "Role", value: "Build & Ship" },
    ],
    terminal: {
      host: "yven@atelier",
      path: "~/systems",
      prompt: "$",
      lines: [
        { type: "cmd", text: "curl https://aps.0000238.xyz/api/schedule/run" },
        { type: "out", text: "→ 200 OK  OR-Tools CP-SAT  resolved 842 tasks  (312ms)" },
        { type: "cmd", text: "curl https://mesmac.0000238.xyz/api/workorder/dispatch" },
        { type: "out", text: "→ 200 OK  dispatched 37 workorders  RBAC ✓  (94ms)" },
        { type: "cmd", text: "curl https://api.0000238.xyz/v1/chat/completions" },
        { type: "out", text: "→ 200 OK  stream  claude-opus-4  gateway routed ✓" },
        { type: "cmd", text: "echo \"$(whoami) — build & ship\"" },
        { type: "out", text: "→ yven — build & ship" },
      ],
    },
  },
  facts: [
    { label: "已上线作品", value: "3" },
    { label: "核心业务域", value: "APS / MES" },
    { label: "工程跨度", value: "Full-stack" },
    { label: "个人定位", value: "Build & Ship" },
  ],
  arsenal: {
    eyebrow: "Tech Arsenal",
    title: "每天在用的工具箱。",
    groups: [
      { label: "Frontend", items: ["Vue 3", "TypeScript", "Element Plus", "Astro", "ECharts", "AntV X6", "dhtmlx-gantt"] },
      { label: "Backend", items: ["Spring Boot 3", "Spring Cloud", "Gateway", "Nacos", "RocketMQ", "Seata", "Sentinel", "MyBatis Plus"] },
      { label: "AI & Gateway", items: ["Go + Gin", "FastAPI", "LangChain", "OpenAI API", "Claude API", "Gemini", "OR-Tools"] },
      { label: "Infra", items: ["Docker", "Nginx", "Redis", "MySQL", "JWT / RBAC", "Playwright", "GitHub Actions"] },
    ],
  },
  telemetry: {
    eyebrow: "By the Numbers",
    title: "可验证的工程体量。",
    summary: "下面这些数字都来自真实仓库和上线报告。",
    nodes: [
      { value: 30, suffix: "+", label: "Controllers", hint: "Titan APS 单服务", position: { x: 12, y: 22 } },
      { value: 400, suffix: "+", label: "REST Mappings", hint: "APS 订单 / 物料 / 排程", position: { x: 36, y: 12 } },
      { value: 220, suffix: "+", label: "单测通过", hint: "MES M8 验收", position: { x: 62, y: 20 } },
      { value: 25, suffix: "", label: "业务模块", hint: "MES 后端 verify", position: { x: 84, y: 32 } },
      { value: 40, suffix: "+", label: "前端视图", hint: "MES 工作台页面", position: { x: 18, y: 64 } },
      { value: 15, suffix: "", label: "Playwright E2E", hint: "端到端覆盖", position: { x: 46, y: 72 } },
      { value: 31, suffix: "k+", label: "Gateway Stars", hint: "Sub2API 上游社区", position: { x: 72, y: 68 } },
      { value: 100, suffix: "%", label: "P0/P1 落地", hint: "MES 整改项", position: { x: 90, y: 60 } },
    ],
    links: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 0, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 2 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 3, to: 7 },
      { from: 2, to: 5 },
    ],
  },
  focus: {
    eyebrow: "Profile",
    title: "理解业务，也把系统做完。",
    cards: [
      {
        title: "业务建模与系统架构",
        text: "能把订单、工序、资源、库存、工单、派工和权限这些业务概念，拆成可实现、可维护的系统模块。",
      },
      {
        title: "前后端一体交付",
        text: "从 Vue 工作台、甘特图和数据表格，到 Spring Boot/Spring Cloud、Go 网关和部署文档，关注的是完整可用的交付链路。",
      },
      {
        title: "AI 工具链产品化",
        text: "把多模型 API、账号池、路由调度、流式响应和工具调用整理成开发者能理解、能接入的产品能力。",
      },
    ],
  },
  workflow: {
    eyebrow: "Approach",
    title: "工作里持续关注的三件事。",
    items: [
      {
        marker: "01",
        title: "进入复杂业务现场",
        text: "APS 和 MES 不是孤立页面，而是围绕制造计划、执行、物料、质量和系统集成展开的真实业务系统。",
      },
      {
        marker: "02",
        title: "把工程细节落到界面里",
        text: "每个项目都带真实截图、访问状态、技术栈、角色划分和实现难点，信息和代码一样经得起拆开看。",
      },
      {
        marker: "03",
        title: "持续把 AI 能力接入工具流",
        text: "Sub2API 聚焦 AI 编程工具、统一 API、模型路由和自托管网关，补上了工业系统之外的产品维度。",
      },
    ],
  },
  sections: {
    projects: {
      eyebrow: "Live Projects",
      title: "三个已上线项目，构成作品主轴。",
      summary: "分别代表工业排程、制造执行和 AI API 网关，也对应我长期积累的系统工程方向。",
      inspector: {
        label: "项目预览",
        title: "移到项目卡片",
        text: "这里会显示项目定位、摘要和技术栈，方便快速比较三个作品。",
        footer: "Personal portfolio preview",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "做制造系统、AI 网关或全栈工程，欢迎继续聊。",
      summary: "源码和项目线索都在 GitHub；其它联系方式会陆续补到这里。",
      primaryHref: "https://github.com/junfengye02-spec",
      primaryLabel: "打开 GitHub",
      copyValue: "junfengye02-spec",
      copyLabel: "复制 GitHub ID",
    },
  },
  projectLibrary: {
    hero: {
      eyebrow: "Project Portfolio",
      title: "项目作品",
      summary:
        "按上线作品组织：每个项目都讲清楚业务问题、角色、关键模块、技术难点、访问状态和可验证截图。",
    },
    actions: {
      home: "回到首页",
      jump: "快速跳转",
    },
    library: {
      eyebrow: "Library",
      title: "作品库",
      searchLabel: "搜索",
      searchPlaceholder: "输入 APS / MES / API / Vue / Go...",
    },
    notes: {
      eyebrow: "Reading Notes",
      title: "阅读方式",
      cards: [
        {
          label: "先看结果",
          text: "首页优先展示上线状态和真实截图，项目都可以直接访问、展开。",
        },
        {
          label: "再看角色",
          text: "详情页展开角色、核心模块、技术挑战和上线结果，方便按工程细节逐层评估。",
        },
      ],
    },
  },
  commandPalette: {
    placeholder: "搜索能力、项目、联系入口...",
    home: "个人主页",
    focus: "能力主线",
    projects: "项目作品",
    contact: "联系",
  },
  footer: {
    label: "yven Personal Homepage / Live systems portfolio",
    gallery: "项目作品",
  },
  system: {
    loadingText: "Opening personal portfolio",
  },
} as const;
