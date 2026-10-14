(() => {
  const dialog = document.querySelector("[data-sign-in-dialog]");
  const form = dialog?.querySelector("[data-sign-in-form]") || document.querySelector("[data-sign-in-page-form]");
  if (!form) return;

  const signInShell = document.querySelector(".sign-in-shell");
  const announcementLanguage = document.documentElement.lang.toLowerCase();
  const announcementCopy = announcementLanguage.startsWith("vi")
    ? { label: "Thông báo", message: "afaxxaq-000 — unname sắp ra mắt, với khả năng học theo ngữ cảnh, bộ nhớ do người dùng kiểm soát, quy trình có thể cấu hình và hỗ trợ đa phương thức cho ngôn ngữ, giọng nói và thị giác.", cta: "Tham gia Early Access", close: "Đóng thông báo" }
    : announcementLanguage.startsWith("zh")
      ? { label: "公告", message: "afaxxaq-000 — unname 即将发布，支持上下文学习、用户可控记忆、可配置工作流，以及覆盖语言、语音和视觉的多模态能力。", cta: "加入 Early Access", close: "关闭公告" }
      : { label: "Announcement", message: "afaxxaq-000 — unname is coming soon, featuring contextual learning, user-controlled memory, configurable workflows, and multimodal support across language, speech, and vision.", cta: "Join Early Access", close: "Close announcement" };
  const announcement = document.createElement("aside");
  announcement.className = "sign-in-announcement";
  announcement.setAttribute("aria-label", announcementCopy.label);
  announcement.innerHTML = `<p class="sign-in-announcement__copy"><span>${announcementCopy.message}</span> <a href="${announcementLanguage.startsWith("vi") ? "/vi" : announcementLanguage.startsWith("zh") ? "/zh-cn" : ""}/contact/">${announcementCopy.cta}</a></p><button type="button" class="sign-in-announcement__close" aria-label="${announcementCopy.close}" data-sign-in-announcement-close>×</button>`;
  signInShell?.before(announcement);
  announcement.querySelector("[data-sign-in-announcement-close]")?.addEventListener("click", () => {
    announcement.hidden = true;
  });
  window.addEventListener("pageshow", () => {
    announcement.hidden = false;
  });

  const status = form.querySelector("[data-sign-in-status]");
  const language = document.documentElement.lang.toLowerCase();
  const standalonePanel = document.querySelector(".sign-in-panel");
  if (standalonePanel && !standalonePanel.querySelector("[data-sign-in-utility]")) {
    const localePrefix = language.startsWith("vi") ? "/vi" : language.startsWith("zh") ? "/zh-cn" : "";
    const utilityLabels = language.startsWith("vi") ? ["Nghiên cứu", "Sản phẩm", "Liên hệ kinh doanh"] : language.startsWith("zh") ? ["研究", "产品", "联系销售"] : ["Research", "Products", "Contact sales"];
    const utility = document.createElement("nav");
    utility.className = "sign-in-utility-nav";
    utility.dataset.signInUtility = "";
    utility.setAttribute("aria-label", "Site");
    utility.innerHTML = `<a href="${localePrefix}/research/">${utilityLabels[0]}</a><a href="${localePrefix}/products/">${utilityLabels[1]}</a><a class="sign-in-utility-nav__contact" href="${localePrefix}/contact/">${utilityLabels[2]}</a>`;
    standalonePanel.prepend(utility);
    const title = standalonePanel.querySelector("#sign-in-page-title");
    if (title && !standalonePanel.querySelector("[data-sign-in-intro]")) {
      const intro = document.createElement("p");
      intro.className = "sign-in-panel__intro";
      intro.dataset.signInIntro = "";
      const description = document.createElement("span");
      description.textContent = language.startsWith("vi") ? "Khám phá ý tưởng, xây dựng cùng AI và tìm hiểu điều gì đến tiếp theo." : language.startsWith("zh") ? "探索想法，与 AI 一起构建，发现下一步。" : "Explore ideas, build with AI, and discover what's next.";
      intro.append(description);
      title.after(intro);
    }
  }
  const signInAside = document.querySelector(".sign-in-aside");
  if (signInAside && !signInAside.querySelector("[data-sign-in-background]")) {
    const background = document.createElement("div");
    background.className = "sign-in-aside__backdrop";
    background.dataset.signInBackground = "";
    background.setAttribute("aria-hidden", "true");
    ["/assets/sign-in-bg-01.webp", "/assets/sign-in-bg-02.webp", "/assets/sign-in-bg-03.webp", "/assets/sign-in-bg-04.webp"].forEach((source, index) => {
      const image = document.createElement("img");
      image.src = source;
      image.alt = "";
      image.width = 1280;
      image.height = 720;
      image.decoding = "async";
      image.loading = "eager";
      image.className = index === 0 ? "is-active" : "";
      background.append(image);
    });
    signInAside.prepend(background);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const images = [...background.querySelectorAll("img")];
      let activeIndex = 0;
      window.setInterval(() => {
        images[activeIndex].classList.remove("is-active");
        activeIndex = (activeIndex + 1) % images.length;
        images[activeIndex].classList.add("is-active");
      }, 4000);
    }
  }
  const passwordLabels = language.startsWith("vi")
    ? { show: "Hiện mật khẩu", hide: "Ẩn mật khẩu", forgot: "Tính năng khôi phục mật khẩu chưa khả dụng. Không có dữ liệu nào được gửi." }
    : language.startsWith("zh")
      ? { show: "显示密码", hide: "隐藏密码", forgot: "密码恢复功能暂不可用。没有数据被提交。" }
      : { show: "Show password", hide: "Hide password", forgot: "Password recovery is not available yet. Nothing was submitted." };
  const setStatus = (message) => {
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
  };

  document.querySelectorAll("[data-sign-in-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!dialog) return;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      form.querySelector("input")?.focus();
    });
  });

  dialog?.querySelector("[data-sign-in-close]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll("[data-sign-in-provider]").forEach((provider) => {
    provider.addEventListener("click", () => {
      setStatus(`${provider.dataset.signInProvider || "This"} sign-in is not available yet. Nothing was submitted.`);
    });
  });

  const emailField = form.querySelector("[data-sign-in-email-field]");
  const phoneField = form.querySelector("[data-sign-in-phone-field]");
  const methodButtons = [...document.querySelectorAll("[data-sign-in-method]")];
  methodButtons.forEach((methodButton) => {
    methodButton.addEventListener("click", () => {
      const phone = methodButton.dataset.signInMethod === "phone";
      methodButtons.forEach((button) => {
        const active = button === methodButton;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      if (emailField) emailField.hidden = phone;
      if (phoneField) phoneField.hidden = !phone;
      const emailInput = emailField?.querySelector("input");
      const phoneInput = phoneField?.querySelector("input");
      if (emailInput) emailInput.required = !phone;
      if (phoneInput) phoneInput.required = phone;
      (phone ? phoneInput : emailInput)?.focus();
    });
  });

  document.querySelectorAll("[data-forgot-password]").forEach((button) => {
    button.addEventListener("click", () => setStatus(passwordLabels.forgot));
  });

  document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    const input = toggle.closest(".sign-in-form__password")?.querySelector("input");
    if (!input) return;
    toggle.addEventListener("click", () => {
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      toggle.setAttribute("aria-label", visible ? passwordLabels.show : passwordLabels.hide);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus(form.dataset.unavailableMessage || "Sign-in is not available yet. Nothing was submitted.");
  });
})();
