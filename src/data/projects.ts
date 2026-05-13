// 以后调整作品展示，主要改这个文件：
// - title / summary：卡片标题和简介
// - description：详情页长描述
// - stack：标签
// - role / caseStudy：详情页里的角色、负责模块、技术难点和上线结果
// - highlights：详情页里的真实观察/补充说明

// - screenshots：详情页截图；第一张也会作为作品卡片缩略图
// - access：访问状态，比如“需登录”或“公开访问”
// - links：详情页按钮；external 为 true 会打开新标签
// - featured：true 会进入首页精选
// 列表顺序就是作品库展示顺序。

export type ProjectCategory = "industrial" | "ai";
export type ProjectAccent = "lime" | "coral" | "cyan" | "ink";

export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectCaseStudy = {
  role: string;
  modules: string[];
  challenges: string[];
  outcomes: string[];
};

export type ProjectDemoAccount = {
  username: string;
  password: string;
  note?: string;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  label: string;
  status: string;
  accent: ProjectAccent;
  year: string;
  metric: string;
  summary: string;
  description: string;
  stack: string[];
  caseStudy?: ProjectCaseStudy;
  demoAccount?: ProjectDemoAccount;
  access?: string;
  highlights?: string[];
  screenshots?: ProjectScreenshot[];
  links: ProjectLink[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "titan-aps",
    title: "Titan APS",
    category: "industrial",
    label: "APS",
    status: "Live",
    accent: "ink",
    year: "2026",
    metric: "高级计划排程",
    summary: "Spring Cloud + OR-Tools 的高级计划排程系统，已上线，覆盖订单、资源、排程、AI 助手和 MES 联动。",
    description:
      "Titan APS 是面向离散制造排产的高级计划排程系统。源码显示它不是单纯的前端演示，而是包含 Spring Cloud Gateway、订单服务、排程服务、资源服务、用户服务和 FastAPI AI 服务的微服务系统；核心排程使用 OR-Tools CP-SAT 建模资源互斥、工序依赖、BOM 展开和正向/JIT 排程目标，前端用 Vue 3、Element Plus、dhtmlx-gantt、ECharts 和 AntV X6 做甘特图、资源负荷、库存推移、工艺路线和 What-If 可视化。",
    stack: ["Vue 3", "Spring Cloud", "OR-Tools CP-SAT", "FastAPI", "RocketMQ", "Seata"],
    access: "需登录查看内页",
    demoAccount: {
      username: "admin",
      password: "Admin@12345",
      note: "演示测试账号，仅用于查看线上演示环境。",
    },
    caseStudy: {
      role:
        "全栈与系统实现：从制造排程业务建模、微服务拆分、排程引擎、前端甘特图工作台，到 AI 助手、部署文档和上线验证链路都由你主导推进。",
      modules: [
        "排程核心：实现订单、工序、资源、工厂日历、任务分段、BOM 递归和外协工序等制造排程模型。",
        "微服务后台：拆分 Gateway、Order、Schedule、Resource、User、AI Service，并通过 Nacos、Feign、RocketMQ、Seata、Sentinel 组织服务治理和事务边界。",
        "前端工作台：建设排程甘特图、订单管理、资源管理、库存推移、资源负荷、工艺路线图、What-If 模拟和 AI 助手入口。",
        "AI 助手：基于 FastAPI + LangChain，将排程查询、资源查询、风险提示和需确认的写操作接入对话式工作流。",
      ],
      challenges: [
        "排程问题是典型 NP-Hard 场景，需要把资源互斥、工序前后约束、交期、提前量、工厂日历和库存短缺转成可求解模型。",
        "甘特图既要表达订单层级、任务分段和交期标记，又要在大数据量下保持滚动、缩放和筛选体验。",
        "排程结果会影响订单状态、库存扣减、告警和 MES 回调，需要处理跨服务事务、消息重试和失败降级。",
        "AI 写操作不能直接执行，需要做 PendingAction、风险等级和用户确认，避免智能助手误改生产数据。",
      ],
      outcomes: [
        "已部署到线上域名，可从个人站进入登录页和真实排程内页截图。",
        "本地源码包含 30+ Controller、400+ REST 映射，覆盖订单、物料、库存、资源、排程、Pegging、What-If、导入导出和 AI 服务。",
        "项目文档记录了 105/105 单测通过、后续单测增强、E2E/契约审计、K8s/Docker/监控/密钥治理等生产化工作。",
        "整体从前端甘特图到后端排程引擎、从服务治理到上线验证，构成一条完整的工业系统交付链路。",
      ],
    },
    highlights: [
      "README 明确覆盖正向排程、JIT 逆向排程、瓶颈排程、模拟退火、OR-Tools CP-SAT 和 What-If 模拟。",
      "前端真实页面包含排程甘特图、指标卡、资源利用率趋势、订单任务时间轴和资源筛选。",
      "GitHub 源码已公开，可按微服务、排程引擎、AI Service 逐层进入阅读。",
    ],
    screenshots: [
      {
        src: "/project-shots/titan-aps-gantt.png",
        alt: "Titan APS 排程甘特图真实内页截图",
        caption: "登录后的排程甘特图：指标卡、资源利用率趋势和订单任务时间轴。",
      },
    ],
    links: [
      { label: "访问线上（需登录）", href: "https://aps.0000238.xyz/", external: true },
      { label: "GitHub 源码", href: "https://github.com/junfengye02-spec/aps-ye", external: true },
    ],
    featured: true,
  },
  {
    slug: "mes-manufacturing-system",
    title: "MES 制造执行系统",
    category: "industrial",
    label: "MES",
    status: "Live",
    accent: "cyan",
    year: "2026",
    metric: "车间执行系统",
    summary: "Vue 3 + Spring Boot 的 MES 制造执行系统，已上线，覆盖计划、工单、派工、质量、物料和 APS 集成。",
    description:
      "MES 制造执行系统面向离散制造车间，覆盖从订单计划、生产计划、生产工单、派工执行、质量管控、异常联络、物料出入库到 APS 集成的完整执行链路。源码采用 Vue 3 + TypeScript + Element Plus 前端和 Spring Boot 3 + MyBatis Plus 多模块后端，包含基础数据、班组、工艺、计划、工单、派工、异常、质量、查询、物料、APS 集成、系统权限等业务域。",
    stack: ["Vue 3", "TypeScript", "Spring Boot", "MyBatis Plus", "JWT/RBAC", "APS Integration"],
    access: "需登录查看内页",
    demoAccount: {
      username: "admin",
      password: "admin123",
      note: "演示测试账号，仅用于查看线上演示环境。",
    },
    caseStudy: {
      role:
        "全栈与业务架构实现：负责从 MES 业务域拆分、后端模块、前端页面、权限体系、APS 对接，到生产就绪整改和上线验收资料的整体落地。",
      modules: [
        "业务模块：基础数据、班组、工艺、计划、生产工单、生产派工、异常联络单、质量、工作查询、物料管理和系统管理。",
        "工单与派工：实现工单生命周期、工单详情子表、人员/设备/班组派工、派工撤销和状态流转。",
        "APS 集成：实现同步配置、同步日志、数据映射、回调接收、HMAC 签名、幂等处理和外部请求追踪。",
        "前端工程：建设 40+ 业务视图、按域拆分 API、通用 DataTable/SearchForm/ImportDialog 组件、Pinia 权限状态和动态菜单。",
      ],
      challenges: [
        "MES 业务链路长，订单计划、生产计划、工单、派工、质量、物料之间存在大量 DTO/VO/Entity 契约对齐问题。",
        "派工是现场执行核心，需要补齐创建、更新、分配、撤销、开工、完工等写接口，并做状态机和冲突校验。",
        "系统要对外接 APS，回调接口不能只靠 permitAll，需要 HMAC-SHA256、API Key、时间戳和 Redis 幂等保护。",
        "管理后台必须同时考虑角色权限、按钮权限、审计日志、Refresh Token 轮转、生产密钥校验和部署可恢复性。",
      ],
      outcomes: [
        "已部署到线上域名，可从个人站进入登录页和真实物料档案内页截图。",
        "GitHub 仓库公开，包含 mes-frontend、mes-backend、monitoring、Docker Compose、HA、微服务和运维文档。",
        "M8 终验报告记录：25 个后端模块 verify 通过、220 个单测通过、15 条 Playwright E2E、P0/P1 整改项 100% 落地。",
        "项目从普通 CRUD 后台升级为可讲生产流程、权限安全、APS 联动和上线治理的完整制造执行案例。",
      ],
    },
    highlights: [
      "源码 README 显示它覆盖订单计划、生产工单、派工调度、质量管控、物料管理和 APS 外部系统集成。",
      "登录后能看到完整左侧业务导航：基础数据、工艺管理、计划管理、生产工单、生产派工、质量、物料和 APS 集成。",
      "从基础数据到派工、质量、物料和外部集成，是一条覆盖车间真实业务流的后台系统。",
    ],
    screenshots: [
      {
        src: "/project-shots/mes-materials.png",
        alt: "MES 制造执行系统物料档案真实内页截图",
        caption: "登录后的物料档案页：业务导航、筛选表单、物料表格和分页区域。",
      },
    ],
    links: [
      { label: "访问线上（需登录）", href: "https://mesmac.0000238.xyz/", external: true },
      { label: "GitHub 源码", href: "https://github.com/junfengye02-spec/mes-ye", external: true },
    ],
    featured: true,
  },
  {
    slug: "sub2api",
    title: "Sub2API",
    category: "ai",
    label: "AI Gateway",
    status: "Live",
    accent: "lime",
    year: "2026",
    metric: "统一 API 网关",
    summary: "AI API 网关产品，面向 Claude、GPT、Gemini、Codex 等模型做统一接口、账号池和路由调度。",
    description:
      "Sub2API 是一个面向开发者的 AI API 网关产品，核心价值是把多种订阅、账号池和模型后端包装成统一 API 入口。结合本地 CLIProxyAPI 源码可以看到，它覆盖 OpenAI/Gemini/Claude/Codex 兼容接口、OAuth 登录、多账号轮询、模型路由、流式/非流式响应、WebSocket、工具调用、多模态输入和管理接口等能力。",
    stack: ["Go", "Gin", "OAuth", "OpenAI Compatible API", "Model Routing", "WebSocket"],
    access: "公开首页",
    caseStudy: {
      role:
        "产品化与网关集成实现：负责把多模型代理能力包装成可访问、可理解、可演示的 AI API Gateway，并围绕开发者调用场景组织首页、模型支持、调用示例和访问入口。",
      modules: [
        "统一接口：提供 OpenAI/Gemini/Claude/Codex 兼容 API，降低不同模型协议之间的接入成本。",
        "账号与路由：支持 OAuth 登录、多账号轮询、模型别名、Provider Routing 和自动 fallback。",
        "开发者能力：支持流式响应、非流式响应、WebSocket、工具调用、多模态输入和本地 SDK 嵌入。",
        "管理与部署：围绕配置文件、Docker、Management API、日志和使用统计队列做自托管网关形态。",
      ],
      challenges: [
        "不同模型家族的请求/响应协议不一致，需要在 OpenAI、Gemini、Claude、Codex 等格式之间做转换和兼容。",
        "多账号池要处理轮询、失效账号、配额、模型映射和 fallback，避免某个上游失败影响整体可用性。",
        "AI 编程工具依赖流式输出和工具调用，网关需要兼容 Claude Code、Codex、Gemini CLI 等客户端行为。",
        "产品页要把复杂代理能力讲成人能快速理解的价值：统一 Key、统一入口、上游调度和按量使用。",
      ],
      outcomes: [
        "已部署公开首页，用户无需登录就能了解产品定位、调用方式和支持模型。",
        "本地源码显示网关基于 Go/Gin 实现，并包含 auth、management、translator、registry、SDK、watcher、logging 等模块。",
        "CLIProxyAPI 上游 GitHub 已有 31k+ Star，方向贴合 AI agent、coding tool 和自托管网关的实际需求。",
        "与 APS / MES 在定位上互补：一边是重业务的工业系统，一边是面向开发者的 AI 基础设施。",
      ],
    },
    highlights: [
      "首页直接解释核心价值：统一 API、账号池调度、会话保持和开发者调用。",
      "终端代码块呈现真实的 curl 调用示例，直接对上开发者的使用场景。",
      "模型支持区展示 Claude、GPT、Gemini、Codex、Antigravity 等接入状态，信息密度贴近产品页。",
    ],
    screenshots: [
      {
        src: "/project-shots/sub2api-home.png",
        alt: "Sub2API AI API Gateway 首页截图",
        caption: "公开首页：订阅转 API、终端调用示意、功能卡片和已支持模型。",
      },
    ],
    links: [{ label: "访问线上（公开）", href: "https://api.0000238.xyz/", external: true }],
    featured: true,
  },
];

export const categoryLabels: Record<ProjectCategory | "all", string> = {
  all: "全部",
  industrial: "工业系统",
  ai: "AI",
};
