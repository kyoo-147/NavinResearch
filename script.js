const copy = {
  en: {
    status: "Major update in progress",
    eyebrow: "Coming soon",
    title: "A new frontier<br>is taking shape.",
    statement:
      "We are working on a major update at an ambitious scale—building a new home for our work across language, speech, and vision. Please stay tuned.",
    contactLabel: "In the meantime",
    contactTitle: "Start a conversation.",
    footer: "Independent AI research · Vietnam",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    documentTitle: "Navin Research — Coming Soon",
    description: "Navin Research is preparing a major update. New research across language, speech, and vision is coming soon.",
    ogDescription: "A new frontier is taking shape. We will be back soon with a major update.",
    ogLocale: "en_US",
    buttonLabel: "Switch to Vietnamese",
  },
  vi: {
    status: "Đang thực hiện bản cập nhật lớn",
    eyebrow: "Sắp ra mắt",
    title: "Một chân trời mới<br>đang thành hình.",
    statement:
      "Chúng tôi đang thực hiện một đợt cập nhật lớn với quy mô đầy tham vọng—xây dựng một không gian mới cho các nghiên cứu về ngôn ngữ, giọng nói và thị giác. Vui lòng chờ đón.",
    contactLabel: "Trong thời gian chờ đợi",
    contactTitle: "Hãy bắt đầu một cuộc trò chuyện.",
    footer: "Nghiên cứu AI độc lập · Việt Nam",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    documentTitle: "Navin Research — Sắp ra mắt",
    description: "Navin Research đang chuẩn bị một đợt cập nhật lớn cho các nghiên cứu về ngôn ngữ, giọng nói và thị giác.",
    ogDescription: "Một chân trời mới đang thành hình. Hãy chờ đón bản cập nhật lớn từ Navin Research.",
    ogLocale: "vi_VN",
    buttonLabel: "Switch to English",
  },
};

const languageButton = document.querySelector(".language");
const copyNodes = document.querySelectorAll("[data-copy]");

function setLanguage(language) {
  const selected = copy[language];
  document.documentElement.lang = language;
  document.title = selected.documentTitle;
  document.getElementById("meta-description").content = selected.description;
  document.getElementById("og-title").content = selected.documentTitle;
  document.getElementById("og-description").content = selected.ogDescription;
  document.getElementById("og-locale").content = selected.ogLocale;
  languageButton.setAttribute("aria-pressed", String(language === "vi"));
  languageButton.setAttribute("aria-label", selected.buttonLabel);

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

languageButton.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "vi" ? "en" : "vi");
});

let preferredLanguage;
try {
  preferredLanguage = localStorage.getItem("navin-language");
} catch {
  preferredLanguage = null;
}
if (preferredLanguage === "vi") setLanguage("vi");

document.getElementById("year").textContent = String(new Date().getFullYear());

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / innerHeight) * 100}%`);
    },
    { passive: true },
  );
}
