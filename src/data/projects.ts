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

const projectOrder = [
  "yven-api",
  "mise-studio",
  "quantclaw",
  "reviewchecklist",
  "aps-mes",
  "wms-ye",
  "adaptive-interview-coach",
];
const projectRank = (slug: string) => {
  const rank = projectOrder.indexOf(slug);
  return rank === -1 ? projectOrder.length : rank;
};

export const projects: Project[] = [
  {
    slug: "wms-ye",
    title: "wmsYe",
    category: "industrial",
    label: "成品仓 WMS",
    status: "Open Source",
    accent: "brass",
    year: "2026",
    metric: "扫码、审批、库存与合同追溯",
    summary: "基于 InvenTree 二次开发的成品仓管理系统，将扫码出入库、整单审批、库存冻结、项目合同与质保管理串成可追溯的仓储流程。",
    description: "wmsYe 面向设备与成品的仓储管理，基于 InvenTree 1.5.1 二次开发。扫码先核对设备、项目、合同与数量，再创建出入库申请；入库通过整单审批后落账，出库加入草稿时冻结可用数量，审批通过后原子扣减。项目档案、合同验收与质保、入库准备单和完整标签保留来源关联，让每次库存变化都能回到业务单据与审批记录。",
    stack: ["Django REST Framework", "React", "TypeScript", "PostgreSQL", "Redis", "Docker Compose"],
    access: "公开源码 · 本地验收截图",
    screenshots: [
      { src: "/project-shots/wms-ye-inbound.png", alt: "wmsYe 入库扫码核对界面，展示测试设备、项目、合同及质保信息", caption: "真实预览系统：扫码带出设备、项目、合同与质保信息，核对后加入申请。画面为本地验收数据。" },
      { src: "/project-shots/wms-ye-receipt.png", alt: "wmsYe 入库填单与打印界面，展示保存的准备单与设备明细", caption: "入库准备与标签：设备、项目、合同和准备数量关联到同一张单据；保存或补打标签不增加库存。" },
      { src: "/project-shots/wms-ye-approval.jpg", alt: "wmsYe 已完成的出库审批记录与申请时间线", caption: "整单审批记录：保留申请人、审批路由与时间线，完成出库后释放对应冻结数量。" },
    ],
    caseStudy: {
      role: "基于 InvenTree 承接成品仓业务二次开发：实现扫码核对、出入库审批、库存冻结、合同质保和标签追溯，并完成中文工作台、容器部署配置与本地流程验证。",
      modules: ["统一扫码入口识别设备编号、库存码与完整标签，核对后生成申请明细。", "整单审批驱动库存变动，覆盖出库冻结、审批扣减、驳回、撤销和超时释放。", "项目、合同、验收日期、质保与入库准备单联动，支持 PDF 标签和可选 QZ Tray 打印。"],
      challenges: ["并发出库要区分库存、冻结与可用数量，通过事务与幂等重试避免超扣或重复落账。", "合同与归属可维护，历史出入库仍需保留办理时的业务快照和来源明细。", "操作员、审批人与管理员职责不同，工作台入口和后端权限共同约束库存操作。"],
      outcomes: ["独立公开仓库提供二开源码、部署配置与中文业务文档。", "本地真实预览系统已验证入库审批、出库冻结与扣减、合同质保和来源追溯。", "标签 PDF 与软件解码已验证；Windows 实物出纸与打印后扫码仍待现场验收。"],
    },
    highlights: ["重复扫描完整标签只定位已有明细，确认数量后才加入申请。", "入库审批前不增加库存；出库先冻结可用数量，审批通过后再扣减。", "合同质保与来源明细贯穿准备单、库存及历史记录，归属维护保留审计。"],
    links: [
      { label: "GitHub 源码", href: "https://github.com/junfengye02-spec/wmsYe", external: true },
      { label: "业务使用说明", href: "https://github.com/junfengye02-spec/wmsYe/blob/main/docs/INVENTREE_WMS_CONTRACT_WARRANTY_GUIDE.md", external: true },
    ],
    featured: true,
  },
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
    metric: "累计 130 亿 Token · 13B",
    summary: "面向开发者的多模型 API 网关：统一协议、模型路由、用量计量与实时排行榜，累计服务 50+ 用户。",
    description: "Yven API 将 GPT、Claude、Gemini 等模型入口统一到一套开发者接口，并围绕上游路由、兼容协议、调用计量和模型排行构建产品体验。项目累计 Token 使用量达到 130 亿（13B），服务 50+ 用户，累计营收达到 ¥1,000。排行榜截图来自真实线上页面，展示的是 2026 年内用量；累计指标由项目作者于 2026 年 10 月更新。",
    stack: ["Go", "Gin", "OAuth", "Model Routing", "OpenAI Compatible", "Usage Metering"],
    access: "公开访问 · 真实排行榜截图",
    screenshots: [
      { src: "/project-shots/yven-api-rankings-2026.png", alt: "Yven API 排行榜今年视图，显示 2026 年内 13.2B Token 用量和模型排名", caption: "线上排行榜今年视图：截图显示 2026 年内 13.2B Token 用量、每周趋势和模型排名；不等同于历史累计值。" },
      { src: "/project-shots/yven-api-home.png", alt: "Yven API 真实产品首页", caption: "统一 AI 网关首页：协议兼容、模型接入与开发者入口。" },
    ],
    caseStudy: {
      role: "产品化与网关集成：把多模型代理、账号池和用量数据组织成可访问、可计量、可运营的开发者产品。",
      modules: ["统一 OpenAI 兼容入口，处理多模型请求/响应转换、流式输出与工具调用。", "按 Provider 与模型做路由、账号池调度、故障切换和调用统计。", "将 Token 计量、模型用量和增长趋势转成公开排行榜。"],
      challenges: ["不同模型协议、限额和流式行为不一致，需要稳定转换和 fallback。", "计量既要对开发者透明，也要支撑运营、成本判断与排行榜更新。", "高用量下需要控制路由延迟、上游失败和账号池热点。"],
      outcomes: ["项目运营数据：累计 130 亿 Token（13B）、50+ 用户、¥1,000 累计营收。", "真实线上排行榜可按今天、本周、本月与今年查看模型用量。", "截图中的 13.2B 为 2026 年内用量，截图拍摄于 2026 年 10 月；历史累计指标由项目作者提供。"],
    },
    highlights: ["130 亿（13B）是项目作者提供的累计 Token 指标；今年视图截图显示 2026 年内 13.2B。", "排行不是静态宣传图，而是直接来自生产计量数据。", "产品价值同时覆盖开发者接入体验与网关运营可观测性。"],
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
    label: "AI 影像创作工作室",
    status: "Live Preview · Generation Paused",
    accent: "oxblood",
    year: "2026",
    metric: "6 个分镜 · 3 个生成单元 · 约 30 秒",
    summary: "让想法入镜：面向故事短片、品牌叙事与概念预告，把灵感推进为蓝图、结构化分镜、生成单元和约 30 秒成片。",
    description: "Mise Studio 是一间在线 AI 影像创作工作室。项目以全局设定约束世界观和视觉语言，用资源库管理可复用素材，再把蓝图拆成结构化分镜与视频生成单元。当前示例项目包含 6 个分镜、3 个视频生成单元，目标成片约 30 秒。视频生成能力已经实现；因第三方生成额度暂时不足，当前开放其余创作与编辑流程。",
    stack: ["FastAPI", "React", "Remotion", "FFmpeg", "Structured Storyboard", "Video Generation"],
    access: "线上产品可访问 · 视频生成调用暂时暂停",
    screenshots: [
      { src: "/project-shots/mise-studio-projects.png", alt: "Mise Studio 真实项目列表与创作入口", caption: "项目入口：以“让想法入镜”开始故事短片、品牌叙事或概念预告。" },
      { src: "/project-shots/mise-studio-storyboard.png", alt: "Mise Studio 真实结构化分镜工作台", caption: "分镜工作台：全局设定、资源库、6 个结构化分镜与 3 个视频生成单元。" },
      { src: "/project-shots/mise-studio-idea.png", alt: "Mise Studio 灵感对话与实时创意简报界面", caption: "灵感规划：对话与实时 Creative Brief 并行，确认前不规划、不生成媒体。" },
      { src: "/project-shots/mise-studio-settings.png", alt: "Mise Studio 世界观与连续性全局设定界面", caption: "全局设定：世界观、人物连续性、视觉规则、声音与生成偏好共同约束后续镜头。" },
      { src: "/project-shots/mise-studio-resources.png", alt: "Mise Studio 项目资源库界面", caption: "资源库：统一管理提示词就绪的角色、场景、道具与分镜引用关系。" },
    ],
    caseStudy: {
      role: "负责从创作入口到结构化分镜的产品化实现，将模糊想法组织为可编辑、可复用、可继续生成的影像项目。",
      modules: ["创作入口：故事短片、品牌叙事、概念预告三种模式。", "项目工作区：全局设定、资源库、蓝图与结构化分镜。", "生成编排：分镜归组为视频生成单元，再进入成片合成。"],
      challenges: ["影像风格、角色和场景需要跨分镜保持一致，不能让每个镜头成为孤立 Prompt。", "分镜与生成任务的粒度不同，需要以生成单元管理时长、素材与重试边界。", "外部视频提供方的额度与成本会影响可用性，产品状态必须如实暴露。"],
      outcomes: ["真实示例项目已形成 6 个结构化分镜与 3 个视频生成单元。", "项目链路覆盖灵感简报、世界观与连续性设定、资源库、分镜、生成单元到约 30 秒成片。", "生成实现保留；额度恢复前明确暂停调用，其他创作与编辑流程仍可体验。"],
    },
    highlights: ["全局设定与资源库为多个分镜共享角色、场景和视觉语言。", "结构化分镜进一步归组为生成单元，让局部调整不必推翻整个项目。", "两张真实线上截图展示项目入口与分镜工作台，并明确生成暂停边界。"],
    links: [
      { label: "访问 Mise Studio", href: "https://video.0000238.xyz", external: true },
      { label: "GitHub 源码", href: "https://github.com/junfengye02-spec/video", external: true },
    ],
    featured: true,
  },
].sort((a, b) => projectRank(a.slug) - projectRank(b.slug));

export const categoryLabels: Record<ProjectCategory | "all", string> = {
  all: "全部",
  industrial: "工业系统",
  agent: "Agent / RAG",
  ai: "AI 产品",
  creative: "创作工具",
};
