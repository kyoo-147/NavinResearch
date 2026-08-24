export const site = {
  origin: "https://navinresearch.com",
  name: "Navin Research",
  email: "michaelbui.contact@gmail.com",
  linkedin: "https://www.linkedin.com/in/michaelbui-engineer",
  github: "https://github.com/kyoo-147",
};

export const sections = ["blog", "research", "docs", "search"];

export const chapters = [
  { slug: "physis", key: "PHYSIS", number: "01", asset: "field-1.webp", domains: { en: "Embodied & Natural Intelligence", vi: "Trí tuệ hiện thân & tự nhiên", "zh-cn": "具身与自然智能" } },
  { slug: "noema", key: "NOEMA", number: "02", asset: "field-2.webp", domains: { en: "Language & Multimodal Reasoning", vi: "Ngôn ngữ & suy luận đa phương thức", "zh-cn": "语言与多模态推理" } },
  { slug: "lumen", key: "LUMEN", number: "03", asset: "field-3.webp", domains: { en: "Vision & Perception", vi: "Thị giác & nhận thức", "zh-cn": "视觉与感知" } },
  { slug: "pneuma", key: "PNEUMA", number: "04", asset: "field-4.webp", domains: { en: "Speech & Voice", vi: "Lời nói & giọng nói", "zh-cn": "语音与声音" } },
  { slug: "poiesis", key: "POIESIS", number: "05", asset: "field-5.webp", domains: { en: "Generative Systems", vi: "Hệ thống sinh tạo", "zh-cn": "生成系统" } },
];

export const legalPages = ["privacy-policy", "terms-of-use"];

export const locales = {
  en: {
    prefix: "",
    htmlLang: "en",
    hreflang: "en",
    ogLocale: "en_US",
    shortLabel: "EN",
    meta: {
      title: "Navin Research — Coming Soon",
      description: "Navin Research studies language, speech, and vision AI models and builds end-to-end products.",
      ogDescription: "Research into language, speech, and vision AI models, plus end-to-end products, is taking shape.",
    },
    home: {
      status: "Major update in progress",
      eyebrow: "Coming soon",
      title: ["A new frontier", "is taking shape."],
      statement: "We are working on a major and ambitious update—bringing together our research into language, speech, and vision AI models, along with the end-to-end products built around them. Please stay tuned.",
      contactLabel: "In the meantime",
      contactTitle: "Start a conversation.",
      contactAria: "Contact information",
      contactLinksAria: "Contact links",
      footer: "Independent AI research · Vietnam",
    },
    common: {
      navAria: "Primary navigation",
      languageAria: "Language selection",
      preparation: "Content is being prepared.",
      footer: "Independent AI research · Vietnam",
      searchLabel: "Search public pages",
      searchPlaceholder: "Search blog, research, and docs",
      noResults: "No matching public page was found.",
    },
    routes: {
      blog: { title: "Blog", description: "Notes and updates from Navin Research.", lede: "A future home for carefully edited notes, project updates, and research reflections." },
      research: { title: "Research", description: "Research directions and methods from Navin Research.", lede: "A future index for real work across language, speech, vision, multimodal systems, and end-to-end AI products." },
      docs: { title: "Docs", description: "Practical documentation for published Navin Research work and tools.", lede: "A future documentation library for work that has been released and can be accurately described." },
      search: { title: "Search", description: "Search the public Navin Research route directory.", lede: "Search the real public surfaces currently available on this website." },
    },
  },
  vi: {
    prefix: "vi",
    htmlLang: "vi",
    hreflang: "vi",
    ogLocale: "vi_VN",
    shortLabel: "VI",
    meta: {
      title: "Navin Research — Sắp ra mắt",
      description: "Navin Research nghiên cứu các mô hình AI ngôn ngữ, giọng nói và thị giác, đồng thời xây dựng các sản phẩm AI đầu cuối.",
      ogDescription: "Các nghiên cứu về mô hình AI ngôn ngữ, giọng nói và thị giác, cùng những sản phẩm AI đầu cuối, đang dần thành hình.",
    },
    home: {
      status: "Đang thực hiện bản cập nhật lớn",
      eyebrow: "Sắp ra mắt",
      title: ["Một chân trời mới", "đang thành hình."],
      statement: "Chúng tôi đang thực hiện một đợt cập nhật lớn và đầy tham vọng—quy tụ các nghiên cứu về mô hình AI ngôn ngữ, giọng nói và thị giác, cùng những sản phẩm AI đầu cuối được xây dựng từ các nghiên cứu đó. Vui lòng chờ đón.",
      contactLabel: "Trong thời gian chờ đợi",
      contactTitle: "Hãy bắt đầu một cuộc trò chuyện.",
      contactAria: "Thông tin liên hệ",
      contactLinksAria: "Các kênh liên hệ",
      footer: "Nghiên cứu AI độc lập · Việt Nam",
    },
    common: {
      navAria: "Điều hướng chính",
      languageAria: "Chọn ngôn ngữ",
      preparation: "Nội dung đang được chuẩn bị.",
      footer: "Nghiên cứu AI độc lập · Việt Nam",
      searchLabel: "Tìm kiếm các trang công khai",
      searchPlaceholder: "Tìm blog, nghiên cứu và tài liệu",
      noResults: "Không tìm thấy trang công khai phù hợp.",
    },
    routes: {
      blog: { title: "Blog", description: "Ghi chú và cập nhật từ Navin Research.", lede: "Không gian tương lai cho các ghi chú được biên tập cẩn thận, cập nhật dự án và suy ngẫm nghiên cứu." },
      research: { title: "Nghiên cứu", description: "Định hướng và phương pháp nghiên cứu tại Navin Research.", lede: "Chỉ mục tương lai cho những công trình thực tế về ngôn ngữ, giọng nói, thị giác, hệ thống đa phương thức và sản phẩm AI đầu cuối." },
      docs: { title: "Tài liệu", description: "Tài liệu thực hành cho các công trình và công cụ đã được Navin Research công bố.", lede: "Thư viện tương lai dành cho những công trình đã được phát hành và có thể mô tả chính xác." },
      search: { title: "Tìm kiếm", description: "Tìm kiếm trong danh mục trang công khai của Navin Research.", lede: "Tìm trong các bề mặt công khai thực tế hiện có trên website." },
    },
  },
  "zh-cn": {
    prefix: "zh-cn",
    htmlLang: "zh-CN",
    hreflang: "zh-CN",
    ogLocale: "zh_CN",
    shortLabel: "CN",
    meta: {
      title: "Navin Research — 即将推出",
      description: "Navin Research 专注于语言、语音和视觉 AI 模型研究，并打造端到端 AI 产品。",
      ogDescription: "语言、语音和视觉 AI 模型研究，以及基于这些研究打造的端到端产品，正在逐步成形。",
    },
    home: {
      status: "重大更新正在进行",
      eyebrow: "即将推出",
      title: ["新的前沿", "正在成形。"],
      statement: "我们正在进行一次大规模且充满雄心的更新——汇集我们对语言、语音与视觉 AI 模型的研究，以及基于这些研究打造的端到端产品。敬请期待。",
      contactLabel: "在此期间",
      contactTitle: "与我们交流。",
      contactAria: "联系信息",
      contactLinksAria: "联系方式",
      footer: "独立 AI 研究 · 越南",
    },
    common: {
      navAria: "主导航",
      languageAria: "选择语言",
      preparation: "内容正在准备中。",
      footer: "独立 AI 研究 · 越南",
      searchLabel: "搜索公开页面",
      searchPlaceholder: "搜索博客、研究和文档",
      noResults: "未找到匹配的公开页面。",
    },
    routes: {
      blog: { title: "博客", description: "Navin Research 的笔记与更新。", lede: "未来用于发布经过认真编辑的笔记、项目更新与研究思考。" },
      research: { title: "研究", description: "Navin Research 的研究方向与方法。", lede: "未来用于索引语言、语音、视觉、多模态系统与端到端 AI 产品方面的真实工作。" },
      docs: { title: "文档", description: "Navin Research 已发布工作与工具的实用文档。", lede: "未来用于收录已经发布且能够准确描述的工作。" },
      search: { title: "搜索", description: "搜索 Navin Research 的公开页面目录。", lede: "搜索本网站当前真实存在的公开页面。" },
    },
  },
};

export const experience = {
  en: {
    chapterEyebrow: "CHAPTER 00 / WEALTH OF NATURE — COMING SOON",
    menu: { open: "Open menu", close: "Close menu", chapters: "Chapters", home: "Home", work: "Work", notes: "Notes", philosophy: "Philosophy", contact: "Contact", back: "Back" },
    wealth: { label: "Chapter 00", title: "WEALTH OF NATURE", statement: "Intelligence does not exist apart from nature. It emerges through perception, language, memory, and action." },
    privacy: "Privacy policy", terms: "Terms of use",
    chapterNotice: "This chapter is being prepared. No studies, findings, metrics, or publication dates are presented here yet.",
    chapterIntro: (domain) => `A future home for carefully documented work concerning ${domain.toLowerCase()}.`,
    legal: {
      "privacy-policy": ["Privacy policy", "This static site does not set analytics cookies or run client-side behavioral tracking. Standard server access logs may be processed for security and operations, then reduced to coarse daily aggregates as described by the site.", "Questions about this website or information voluntarily sent to the contact address may be directed to michaelbui.contact@gmail.com."],
      "terms-of-use": ["Terms of use", "This website is provided for public information. Pages marked coming soon describe planned editorial and research areas; they are not published studies, findings, or promises of delivery.", "Original text and visual assets must not be reused in a misleading way. Contact michaelbui.contact@gmail.com with questions about permitted use."],
    },
  },
  vi: {
    chapterEyebrow: "CHAPTER 00 / WEALTH OF NATURE — COMING SOON",
    menu: { open: "Mở menu", close: "Đóng menu", chapters: "Các chương", home: "Trang chủ", work: "Công trình", notes: "Ghi chú", philosophy: "Triết lý", contact: "Liên hệ", back: "Quay lại" },
    wealth: { label: "Chương 00", title: "SỰ PHONG PHÚ CỦA TỰ NHIÊN", statement: "Trí tuệ không tồn tại tách rời tự nhiên. Nó hình thành qua tri giác, ngôn ngữ, ký ức và hành động." },
    privacy: "Chính sách riêng tư", terms: "Điều khoản sử dụng",
    chapterNotice: "Chương này đang được chuẩn bị. Hiện chưa có nghiên cứu, phát hiện, số liệu hay ngày công bố nào được trình bày.",
    chapterIntro: (domain) => `Không gian tương lai cho các công trình được ghi chép cẩn trọng về ${domain.toLowerCase()}.`,
    legal: {
      "privacy-policy": ["Chính sách riêng tư", "Website tĩnh này không đặt cookie phân tích và không theo dõi hành vi phía trình duyệt. Nhật ký truy cập máy chủ tiêu chuẩn có thể được xử lý cho bảo mật và vận hành, sau đó chỉ được rút gọn thành số liệu tổng hợp theo ngày.", "Các câu hỏi về website hoặc thông tin tự nguyện gửi đến địa chỉ liên hệ có thể được gửi tới michaelbui.contact@gmail.com."],
      "terms-of-use": ["Điều khoản sử dụng", "Website này cung cấp thông tin công khai. Các trang ghi sắp ra mắt mô tả lĩnh vực biên tập và nghiên cứu dự kiến; chúng không phải nghiên cứu, phát hiện đã công bố hay cam kết phát hành.", "Không được tái sử dụng văn bản và tài sản hình ảnh gốc theo cách gây hiểu lầm. Liên hệ michaelbui.contact@gmail.com để hỏi về quyền sử dụng."],
    },
  },
  "zh-cn": {
    chapterEyebrow: "CHAPTER 00 / WEALTH OF NATURE — COMING SOON",
    menu: { open: "打开菜单", close: "关闭菜单", chapters: "章节", home: "首页", work: "工作", notes: "笔记", philosophy: "理念", contact: "联系", back: "返回" },
    wealth: { label: "第 00 章", title: "自然之丰", statement: "智能并非独立于自然而存在。它通过感知、语言、记忆与行动涌现。" },
    privacy: "隐私政策", terms: "使用条款",
    chapterNotice: "本章节正在准备中。目前尚未在此展示研究、发现、指标或发布日期。",
    chapterIntro: (domain) => `未来用于认真记录与${domain}相关工作的空间。`,
    legal: {
      "privacy-policy": ["隐私政策", "本静态网站不设置分析 Cookie，也不运行客户端行为跟踪。标准服务器访问日志可能为安全与运维而处理，随后仅缩减为按日汇总的粗粒度数据。", "有关本网站或自愿发送至联系地址的信息，请联系 michaelbui.contact@gmail.com。"],
      "terms-of-use": ["使用条款", "本网站用于提供公共信息。标记为即将推出的页面描述计划中的编辑与研究方向；它们不代表已发布研究、发现或交付承诺。", "不得以误导方式重用原创文字与视觉资产。如需询问许可，请联系 michaelbui.contact@gmail.com。"],
    },
  },
};

export function localePath(localeKey, section = "") {
  const prefix = locales[localeKey].prefix;
  const parts = [prefix, section].filter(Boolean);
  return `/${parts.join("/")}${parts.length ? "/" : ""}`;
}
