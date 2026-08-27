export type ProjectCategory = "industrial" | "agent" | "ai" | "creative";
export type ProjectAccent = "forest" | "oxblood" | "brass" | "ink";

export type ProjectLink = { label: string; href: string; external?: boolean };
export type ProjectScreenshot = { src: string; alt: string; caption: string };
export type ProjectCaseStudy = {
  role: string;
  modules: string[];
  challenges: string[];
  outcomes: string[];
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
  access?: string;
  highlights?: string[];
  screenshots?: ProjectScreenshot[];
  caseStudy?: ProjectCaseStudy;
  links: ProjectLink[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "aps-mes",
    title: "APS × MES",
    category: "industrial",
    label: "制造协同系统",
    status: "Open Source",
    accent: "forest",
    year: "2026",
    metric: "从计划排程到车间执行",
    summary: "将高级计划排程与制造执行合成一条业务链：订单计划、CP-SAT 排程、工单下发、派工执行、质量与物料回传。",
    description: "这不是两个并排的管理后台，而是一条从计划到执行再回传的制造闭环。APS 用 Google OR-Tools CP-SAT 建模工序前后关系、资源互斥、交期与工厂日历；MES 承接工单、派工、质量、物料和现场异常，再通过消息与回调把执行状态反馈给计划层。",
    stack: ["OR-Tools CP-SAT", "Spring Cloud", "Vue 3", "Spring Boot", "MyBatis Plus", "RocketMQ"],
    access: "两个公开源码仓库 · 真实联调截图",
    screenshots: [
      { src: "/project-shots/aps-gantt-actual.png", alt: "Titan APS 真实排程甘特图", caption: "APS 排程工作台：订单、资源利用率、交期指标与甘特图联动。" },
      { src: "/project-shots/mes-workorders-actual.png", alt: "MES 真实生产工单页面", caption: "MES 生产工单：承接排程结果并进入派工、质量与物料执行。" },
      { src: "/project-shots/aps-load-actual.png", alt: "Titan APS 真实资源负荷页面", caption: "资源负荷视图：用真实负载验证计划可执行性。" },
    ],
    caseStudy: {
      role: "全栈与业务建模：从制造流程拆解、排程约束建模、前后端实现，到 APS/MES 数据契约和联调验证。",
      modules: ["订单计划 → 生产计划 → 工单下发 → 派工执行 → 质量管控 → 物料流转。", "基于 CP-SAT 表达工序依赖、资源互斥、工厂日历、交期与重新排程。", "APS 结果写回 MES 工单与派工任务，MES 通过回调反馈库存、质量和执行异常。"],
      challenges: ["计划层追求整体最优，执行层面对实时变化，两者需要可重算、可追溯的数据边界。", "插单、设备停机、交期变更和物料未齐套会同时影响交期与资源冲突。", "长链路状态流转要处理消息幂等、失败重试、权限控制和异常恢复。"],
      outcomes: ["形成覆盖订单、工单、派工、质量、物料与资源数据的双子系统。", "在甘特图、资源负荷与工单工作台中保留可验证的真实运行界面。", "两个公开仓库分别提供 APS 排程引擎与 MES 制造执行源码。"],
    },
    highlights: ["调度引擎不是固定规则演示，而是面向多约束组合的 CP-SAT 求解模型。", "MES 不止 CRUD：包含工单状态机、派工、质量、物料和 APS 集成边界。", "以可重排、可回传、可审计为核心，把计划与执行做成闭环。"],
    links: [
      { label: "APS GitHub", href: "https://github.com/junfengye02-spec/aps-ye", external: true },
      { label: "MES GitHub", href: "https://github.com/junfengye02-spec/mes-ye", external: true },
    ],
    featured: true,
  },
  {
    slug: "reviewchecklist",
    title: "ReviewChecklist",
    category: "agent",
    label: "AI 审评平台",
    status: "Open Source",
    accent: "oxblood",
    year: "2026",
    metric: "结论可定位、可复核、可恢复",
    summary: "面向招投标文件的审评分工系统：把解析、证据定位、AI 判断、规则校验与人工复核串成可恢复的 Agent 工作流。",
    description: "ReviewChecklist 解决的不是‘让模型读一份 PDF’，而是让审评结论有证据、有规则、有状态。LangGraph 串联文件解析、混合检索、证据核验、要点抽取、规则比对和报告写入；异常任务转人工并保留检查点，避免长流程失败后从头开始。",
    stack: ["LangGraph", "FastAPI", "PyMuPDF", "BM25 + Vector + RRF", "MySQL", "MinIO"],
    access: "公开源码使用合成演示数据 · 项目交付数据来自简历",
    caseStudy: {
      role: "负责审评工作台的完整链路：Excel/ZIP/Word 数据导入、证据检索、人工意见匹配、审评要点优化、复核和结果回写。",
      modules: ["LangGraph 编排解析、检索、判断、校验、人工复核和结果写入。", "PyMuPDF 按页解析，结合 BM25、向量检索与 RRF 定位跨章节证据。", "FastAPI + MySQL + MinIO 异步任务服务，以检查点支持重试、取消与故障接管。"],
      challenges: ["错误结论必须能回到页码、章节和原文片段，不能只给不可解释的模型答案。", "长文档、多规则与多轮优化会放大超时和级联错误，需要人工复核闸门。", "确定性工具负责日期、金额和数量校验，模型只处理语义判断。"],
      outcomes: ["项目交付处理 47 家企业、457 条人工审评意见。", "完成 355 条一一映射，并补充 102 条校验结果与人工确认。", "公开仓库明确标注合成/临时演示边界，不包含真实招标或审批数据。"],
    },
    highlights: ["把检索命中变成可核验证据，而不是把相似片段直接当答案。", "AI 结论、工具校验与人工复核三条路径都留有状态和恢复点。", "用受控优化回路改进审评要点，避免未经确认的结果直接覆盖生产数据。"],
    links: [{ label: "GitHub 源码", href: "https://github.com/junfengye02-spec/ReviewChecklist", external: true }],
    featured: true,
  },
  {
    slug: "quantclaw",
    title: "QuantClaw",
    category: "ai",
    label: "私有量化研究框架",
    status: "Private · Architecture",
    accent: "brass",
    year: "2026",
    metric: "研究、决策、执行与风控分层",
    summary: "五层量化框架把市场情报、因子发现、多智能体决策、确定性执行与 MLOps 连接起来；Live 默认关闭。",
    description: "QuantClaw 把 LLM 放在适合它的位置：生成假设、阅读世界状态、进行多视角辩论；把仓位、止损、熔断和执行放进确定性闸门。框架通过 Pydantic 契约和 ZeroMQ 连接五层运行时，并支持 backtest、shadow、paper 三种模式。私有源码不公开，只展示 README 允许公开的架构与研究依据。",
    stack: ["Python", "Pydantic", "ZeroMQ", "Backtest", "Multi-Agent", "MLOps"],
    access: "私有仓库 · 仅展示 README 架构和公开研究依据",
    screenshots: [
      { src: "/project-shots/quantclaw-portfolio.png", alt: "QuantClaw 用户提供的运行账户组合曲线快照", caption: "运行账户快照：从 10 万本金开始，期间组合价值最高超过 12 万；截图由项目作者提供。" },
    ],
    caseStudy: {
      role: "独立设计可复用研究框架：定义五层运行时、跨层消息契约、Profile Runner、风险闸门与评估闭环。",
      modules: ["Intelligence：市场、新闻、宏观与监管信息汇聚为 WorldStateVector。", "Alpha + Committee：LLM 因子假设、沙箱筛选、Bull/Bear/Quant/Risk 多智能体辩论。", "Execution + MLOps：DirectiveGate、RiskOverlay、CircuitBreaker、TWAP/VWAP 与因子衰减监测。"],
      challenges: ["LLM 指令同时包含噪声和潜在 Alpha，必须与可证明的风险规则隔离。", "研究、回测与执行要共享契约，但不能让实验组件绕过风控直接触达 Live。", "因子有效性会随市场状态衰减，需要 walk-forward、shadow 与持续评估。"],
      outcomes: ["形成 Intelligence / Alpha / Committee / Execution / MLOps 五层架构。", "支持 backtest、shadow、paper；Live 默认禁用，执行前必须经过确定性风险闸门。", "研究路径参考 TradingAgents、Qlib、RD-Agent、FinRL 与多篇公开论文。"],
    },
    highlights: ["多智能体讨论不等于可交易指令：Risk Officer 与 DirectiveGate 拥有独立否决权。", "Alpha 假设先进入隔离沙箱、快速筛选与 walk-forward，再决定是否进入影子组合。", "参考 TradingAgents、Microsoft Qlib / RD-Agent 与 FinRL，但运行时和风控边界独立设计。"],
    links: [
      { label: "因子指标站", href: "https://quant.0000238.xyz", external: true },
      { label: "GitHub 主页", href: "https://github.com/junfengye02-spec", external: true },
      { label: "TradingAgents", href: "https://github.com/TauricResearch/TradingAgents", external: true },
      { label: "Microsoft Qlib", href: "https://github.com/microsoft/qlib", external: true },
    ],
    featured: true,
  },
  {
    slug: "adaptive-interview-coach",
    title: "Adaptive Interview Coach",
    category: "agent",
    label: "Job Search Codex Skill",
    status: "Public GitHub",
    accent: "brass",
    year: "2026",
    metric: "数千条岗位信息 · 持续面试辅助",
    summary: "从最新简历出发，持续发现并核验岗位，再把有效 JD 转成角色画像、模拟面试和弱点复习队列。",
    description: "Adaptive Interview Coach 是一个端到端求职与面试训练 Codex Skill。它通过牛客、公司官网、校招平台与公共渠道做四路岗位发现，只有详情页可核验且仍开放的职位才进入可审计 Excel；随后将有效 JD 聚类为角色画像，映射简历差距，并驱动一次一题的模拟面试、弱点讲解和 1/3/7 天间隔复习。项目已为身边同学发现、整理和筛选数千条岗位信息，并持续辅助面试准备。",
    stack: ["Codex Skill", "Web Search", "Browser", "Python", "openpyxl", "Tasks & Automations"],
    access: "公开 GitHub 项目 · 影响数据由项目作者提供",
    caseStudy: {
      role: "独立设计求职工作区、四路岗位发现、证据校验、去重合并、JD 画像、模拟面试与弱点复习闭环。",
      modules: ["最新简历与配置进入 workspace.py，生成四渠道发现计划。", "详情页证据通过后，jobs.py 完成规范化、去重、过期检测与角色画像。", "简历 × JD 画像驱动一题一问式面试，weaknesses.py 管理弱点和间隔复习。"],
      challenges: ["岗位聚合页经常过期或缺少关键字段，必须回到详情页核验开放状态。", "同一职位会以不同链接和标题重复出现，需要 URL 规范化、哈希 ID 与模糊去重。", "面试训练必须由真实 JD 与个人简历共同约束，不能生成泛化题库。"],
      outcomes: ["为身边同学累计发现、整理与筛选数千条岗位信息。", "用可审计 Excel 保留岗位来源、详情页证据、状态与更新时间。", "通过自动化持续更新岗位并辅助模拟面试与弱点复习。"],
    },
    highlights: ["Evidence first：只有详情页可验证的开放岗位才进入主表。", "JD driven：从有效岗位聚类角色画像，再映射个人简历与能力差距。", "Continuous loop：岗位增量更新、一次一题面试和 1/3/7 天弱点复习互相衔接。"],
    links: [
      { label: "GitHub 项目", href: "https://github.com/junfengye02-spec/JobSearchTraining_skill", external: true },
      { label: "查看 SKILL.md", href: "https://github.com/junfengye02-spec/JobSearchTraining_skill/blob/main/SKILL.md", external: true },
    ],
    featured: true,
  },
  {
    slug: "yven-api",
    title: "Yven API",
    category: "ai",
    label: "统一模型网关",
    status: "Live",
    accent: "ink",
    year: "2026",
    metric: "累计 100 亿+ Token",
    summary: "面向开发者的多模型 API 网关：统一协议、模型路由、用量计量与实时排行榜，累计服务 50+ 用户。",
    description: "Yven API 将 GPT、Claude、Gemini 等模型入口统一到一套开发者接口，并围绕上游路由、兼容协议、调用计量和模型排行构建产品体验。项目目前累计 Token 使用量超过 100 亿，服务 50+ 用户，累计营收超过 ¥500。排行榜截图来自真实线上页面，展示的是当周用量；累计指标来自项目运营数据。",
    stack: ["Go", "Gin", "OAuth", "Model Routing", "OpenAI Compatible", "Usage Metering"],
    access: "公开访问 · 真实排行榜截图",
    screenshots: [
      { src: "/project-shots/yven-api-rankings.png", alt: "Yven API 真实 Token 排行榜", caption: "线上排行榜：当周 Token 用量、模型分布和增长趋势实时更新。" },
      { src: "/project-shots/yven-api-home.png", alt: "Yven API 真实产品首页", caption: "统一 AI 网关首页：协议兼容、模型接入与开发者入口。" },
    ],
    caseStudy: {
      role: "产品化与网关集成：把多模型代理、账号池和用量数据组织成可访问、可计量、可运营的开发者产品。",
      modules: ["统一 OpenAI 兼容入口，处理多模型请求/响应转换、流式输出与工具调用。", "按 Provider 与模型做路由、账号池调度、故障切换和调用统计。", "将 Token 计量、模型用量和增长趋势转成公开排行榜。"],
      challenges: ["不同模型协议、限额和流式行为不一致，需要稳定转换和 fallback。", "计量既要对开发者透明，也要支撑运营、成本判断与排行榜更新。", "高用量下需要控制路由延迟、上游失败和账号池热点。"],
      outcomes: ["项目运营数据：累计 100 亿+ Token、50+ 用户、¥500+ 累计营收。", "真实线上排行榜可按今天、本周、本月与今年查看模型用量。", "当前截图中的 1.85B 为拍摄时的当周用量，不与累计指标混淆。"],
    },
    highlights: ["100 亿+ 是累计 Token 指标；页面截图以当周数据展示模型分布。", "排行不是静态宣传图，而是直接来自生产计量数据。", "产品价值同时覆盖开发者接入体验与网关运营可观测性。"],
    links: [
      { label: "访问 Yven API", href: "https://api.0000238.xyz/", external: true },
      { label: "查看排行榜", href: "https://api.0000238.xyz/rankings", external: true },
    ],
    featured: true,
  },
  {
    slug: "mise-studio",
    title: "Mise Studio",
    category: "creative",
    label: "OpenMontage 二开",
    status: "In Development",
    accent: "oxblood",
    year: "2026",
    metric: "多智能体视频生成工作台",
    summary: "把故事、分镜、素材、预览、配音和时间线放在同一工作台，让视频生成从一次 Prompt 变成可编辑流程。",
    description: "Mise Studio 是基于 OpenMontage 二次开发的视频生成网站。界面围绕真实创作路径设计：左侧组织场景和分镜，中间预览当前镜头，下方编辑视频/音频时间线，右侧调整画面与素材属性；后端通过多智能体协作完成研究、脚本、图像、视频、配音与合成。",
    stack: ["FastAPI", "React", "Remotion", "FFmpeg", "Multi-Agent", "Storyboarding"],
    access: "本地二开项目 · 展示真实前端工作台",
    screenshots: [{ src: "/project-shots/mise-studio-workbench.png", alt: "Mise Studio 真实视频工作台界面", caption: "真实工作台：场景列表、预览、时间线、配音轨与属性面板。" }],
    caseStudy: {
      role: "在 OpenMontage 基础上进行产品化二开，重组视频生成流程、工作台信息架构和多智能体协作边界。",
      modules: ["创作输入：主题、研究素材与脚本结构。", "分镜生产：场景拆分、画面提示、素材生成与镜头预览。", "后期工作台：时间线、音轨、属性调整、渲染与交付。"],
      challenges: ["生成式视频不是单次请求，需要管理场景、素材、版本、时长和依赖。", "图像、视频、配音与字幕任务耗时不同，必须用可追踪的异步编排串联。", "界面要兼顾自动生成与人工编辑，让每一步都能预览、替换和重做。"],
      outcomes: ["完成从故事板到时间线的可视化工作台，真实界面已纳入作品展示。", "以 Agent、Remotion 与 FFmpeg 组织内容生成和最终渲染链路。", "项目使用 Mise Studio 产品名，并保留 OpenMontage 二开来源说明。"],
    },
    highlights: ["把生成过程拆成可编辑镜头，而不是只交付一个不可修改的视频文件。", "时间线同时表达画面、音轨与片段长度，适合人工介入和局部重生成。", "真实工作台截图直接展示前端使用方式，不用概念图代替产品。"],
    links: [
      { label: "访问 Mise Studio", href: "https://video.0000238.xyz", external: true },
      { label: "GitHub 源码", href: "https://github.com/junfengye02-spec/video", external: true },
      { label: "OpenMontage", href: "https://github.com/OpenMontage/OpenMontage", external: true },
    ],
    featured: true,
  },
];

export const categoryLabels: Record<ProjectCategory | "all", string> = {
  all: "全部",
  industrial: "工业系统",
  agent: "Agent / RAG",
  ai: "AI 产品",
  creative: "创作工具",
};
