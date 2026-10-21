export const siteContent = {
  brand: { name: "YE JUNFENG", chinese: "叶峻枫" },
  pages: {
    home: {
      title: "叶峻枫 | AI 应用开发",
      description: "叶峻枫，2027 届计算机科学与技术本科生，聚焦 AI Agent、多模态 RAG 与后端开发。展示招投标智能审评、APS × MES、仓储管理及 AI 产品实践。",
    },
    projects: {
      title: "项目作品 | 叶峻枫",
      description: "ReviewChecklist、APS × MES、wmsYe、QuantClaw、Adaptive Interview Coach、Yven API 与 Mise Studio 七个独立项目案例。",
    },
  },
  hero: {
    eyebrow: "AI APPLICATION DEVELOPER · 2027",
    title: "叶峻枫",
    statement: "把 Agent、RAG 与复杂业务，做成真正可用的系统。",
    summary: "2027 届计算机科学与技术本科生，聚焦 AI Agent、多模态 RAG 与后端开发。在企业实习中完成智能体、多模态审核服务和审评系统交付，也独立实践制造排程、仓储管理与 AI 产品。",
  },
  metrics: [
    { value: "130亿", label: "累计 Token" },
    { value: "50+", label: "用户" },
    { value: "¥1,000", label: "累计营收" },
    { value: "10+", label: "开源项目评估" },
    { value: "5", label: "类 MCP 工具" },
  ],
  profile: [
    { index: "01", title: "需求与业务建模", text: "直接对接业务需求，将审评规则、排程约束和库存流转拆成状态、接口与验收用例。" },
    { index: "02", title: "Agent 与多模态 RAG", text: "用 LangGraph、混合检索、Rerank 和视觉核验组织证据，结合确定性工具与人工确认完成判断。" },
    { index: "03", title: "后端与工程交付", text: "用事务、幂等、租约和检查点处理长任务与异常，再通过测试、容器部署和交接文档完成交付。" },
  ],
  experience: [
    {
      period: "2026.03 — 2026.08",
      company: "广州软件应用技术研究院",
      role: "AI 应用开发实习生",
      summary: "直接对接甲方，独立搭建业务智能体，交付多模态审核服务、MCP 工具与招投标智能审评系统。",
      evidence: [
        { value: "4", label: "类智能体" },
        { value: "5", label: "类 MCP 工具" },
        { value: "47", label: "个工具测试" },
        { value: "10+", label: "项开源评估" },
      ],
      details: [
        "独立搭建死因链辅助填写、ICD 编码填写、症候群匹配、智能问数 4 类智能体，完成工具调用、多轮对话与联调交付。",
        "开发并上线 img_check 多模态审核服务，支持 PDF 与 6 种图片格式，通过 OCR、Chroma 与 Rerank 定位页面，返回审核结论和页码引用。",
        "用 FastMCP 封装视觉审核、新闻采集、PPT、企业查询与浏览器自动化工具，统一校验、异常与超时处理，配套 47 个测试用例和交接文档。",
        "部署测试 10+ 开源项目，评估依赖兼容、资源占用、接口稳定性与接入成本；独立负责招投标文件审评系统的工作流与规则迭代。",
      ],
      projectHref: "#reviewchecklist",
      projectLabel: "实习项目：招投标智能审评",
    },
    {
      period: "2025.12 — 2026.03",
      company: "东方电气集团数字科技有限公司",
      role: "研发实习生",
      summary: "参与 MES 维修品完工入库、设备台账与班次配置开发，覆盖需求确认、测试回归和数据准备。",
      evidence: [
        { value: "MES", label: "功能开发" },
        { value: "SAP", label: "规则核对" },
        { value: "BOM", label: "数据清洗" },
        { value: "QA", label: "测试回归" },
      ],
      details: [
        "与现场业务确认需求和验收要点，参与维修品完工入库、设备台账、班次配置，处理工单筛选、序列号关联、仓库带出与状态更新。",
        "围绕维修品类型、工单状态、序列号和仓库关联编写用例，核对 SAP 专项规则，跟踪问题修复与回归验证。",
        "用 Python 清洗物料、BOM 与历史 Excel 数据，支持导入校验，并参与编写需求分析、功能说明和测试报告。",
      ],
      projectHref: "#aps-mes",
      projectLabel: "个人项目：APS × MES",
    },
  ],
  skills: [
    { label: "Agent 与 LLM", items: ["LangGraph", "Multi-Agent", "ReAct", "Function Calling", "FastMCP", "Prompt Engineering"] },
    { label: "RAG 与检索", items: ["PaddleOCR / PyMuPDF", "BM25 + 向量 + RRF", "Chroma", "Rerank", "多模态 RAG", "引用溯源与回测"] },
    { label: "后端开发", items: ["Python", "FastAPI / LangChain", "Java", "Spring Boot / Cloud", "MyBatis-Plus", "OR-Tools CP-SAT"] },
    { label: "数据与任务", items: ["MySQL", "Redis", "RocketMQ", "MinIO", "事务与分布式锁", "幂等与断点恢复"] },
    { label: "工程与部署", items: ["Vue 3", "Docker", "Git", "GitLab CI", "GitHub Actions", "测试与交付文档"] },
    { label: "AI 编程与开源", items: ["Claude Code", "Codex", "Agent Skill", "PPTAgent / VRAG", "浏览器自动化", "开源组件选型"] },
  ],
  education: {
    school: "广州城市理工学院",
    degree: "计算机科学与技术 · 本科 · CET-4 480",
    period: "2023.09 — 2027.07",
  },
  contact: {
    email: "3050581755@qq.com",
    github: "https://github.com/junfengye02-spec",
    resume: "/ye-junfeng-resume.pdf",
  },
};
