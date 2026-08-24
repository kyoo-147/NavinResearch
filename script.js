const copy = {
  en: {
    status: "Major update in progress",
    eyebrow: "Coming soon",
    title: "A new frontier<br>is taking shape.",
    statement:
      "We are researching language, speech, and vision AI models—and building end-to-end products around them. A new home for this work is taking shape. Please stay tuned.",
    contactLabel: "In the meantime",
    contactTitle: "Start a conversation.",
    footer: "Independent AI research · Vietnam",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    documentTitle: "Navin Research — Coming Soon",
    description: "Navin Research studies language, speech, and vision AI models and builds end-to-end products.",
    ogDescription: "Research into language, speech, and vision AI models, plus end-to-end products, is taking shape.",
    ogLocale: "en_US",
    languageLabel: "Language selection",
  },
  vi: {
    status: "Đang thực hiện bản cập nhật lớn",
    eyebrow: "Sắp ra mắt",
    title: "Một chân trời mới<br>đang thành hình.",
    statement:
      "Chúng tôi nghiên cứu các mô hình AI về ngôn ngữ, giọng nói và thị giác, đồng thời xây dựng các sản phẩm trọn quy trình trên nền tảng đó. Một không gian mới cho công việc này đang thành hình. Hãy đón chờ.",
    contactLabel: "Trong thời gian chờ đợi",
    contactTitle: "Hãy bắt đầu một cuộc trò chuyện.",
    footer: "Nghiên cứu AI độc lập · Việt Nam",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    documentTitle: "Navin Research — Sắp ra mắt",
    description: "Navin Research nghiên cứu các mô hình AI về ngôn ngữ, giọng nói và thị giác, đồng thời xây dựng các sản phẩm trọn quy trình.",
    ogDescription: "Navin Research đang nghiên cứu các mô hình AI về ngôn ngữ, giọng nói và thị giác, cùng những sản phẩm trọn quy trình.",
    ogLocale: "vi_VN",
    languageLabel: "Chọn ngôn ngữ",
  },
  zh: {
    status: "重大更新正在进行",
    eyebrow: "即将推出",
    title: "新的边界<br>正在成形。",
    statement:
      "我们专注于语言、语音和视觉 AI 模型的研究，并以此打造端到端的产品。一个承载这些工作的全新空间正在成形，敬请期待。",
    contactLabel: "在此期间",
    contactTitle: "开始交流。",
    footer: "独立 AI 研究 · 越南",
    email: "电子邮件",
    linkedin: "领英",
    github: "GitHub",
    documentTitle: "Navin Research — 即将推出",
    description: "Navin Research 专注于语言、语音和视觉 AI 模型研究，并打造端到端产品。",
    ogDescription: "我们正在研究语言、语音和视觉 AI 模型，并打造端到端产品。新的边界正在成形。",
    ogLocale: "zh_CN",
    languageLabel: "语言选择",
  },
};

const languageButtons = document.querySelectorAll("[data-language]");
const copyNodes = document.querySelectorAll("[data-copy]");
const languageGroup = document.querySelector(".language");

function setLanguage(language) {
  const selected = copy[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  document.title = selected.documentTitle;
  document.getElementById("meta-description").content = selected.description;
  document.getElementById("og-title").content = selected.documentTitle;
  document.getElementById("og-description").content = selected.ogDescription;
  document.getElementById("og-locale").content = selected.ogLocale;
  languageGroup.setAttribute("aria-label", selected.languageLabel);

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });

  copyNodes.forEach((node) => {
    const value = selected[node.dataset.copy];
    if (!value) return;
    if (node.dataset.copy === "title") node.innerHTML = value;
    else node.textContent = value;
  });

  try {
    localStorage.setItem("navin-language", language);
  } catch {
    // The page remains fully functional when storage is unavailable.
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

let preferredLanguage;
try {
  preferredLanguage = localStorage.getItem("navin-language");
} catch {
  preferredLanguage = null;
}
if (copy[preferredLanguage]) setLanguage(preferredLanguage);

document.getElementById("year").textContent = String(new Date().getFullYear());

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setTimeout(() => document.documentElement.classList.add("motion-ready"), 3000);
  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / innerHeight) * 100}%`);
    },
    { passive: true },
  );
}
