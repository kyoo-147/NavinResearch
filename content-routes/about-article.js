(() => {
  const article = document.querySelector("[data-about-article]");
  if (!article) return;

  const toolbar = document.querySelector("[data-about-toolbar]");
  const listenButton = toolbar?.querySelector("[data-listen]");
  const shareButton = toolbar?.querySelector("[data-share]");
  const status = toolbar?.querySelector("[data-toolbar-status]");
  toolbar?.querySelectorAll("[data-audio-control]").forEach((control) => control.removeAttribute("title"));
  const listenIcon = toolbar?.querySelector("[data-listen-icon]");
  const elapsed = toolbar?.querySelector("[data-listen-elapsed]");
  const seekBack = toolbar?.querySelector("[data-seek-back]");
  const seekForward = toolbar?.querySelector("[data-seek-forward]");
  const speedButton = toolbar?.querySelector("[data-speed]");
  const normalizeSeekIcon = (button, forward) => {
    const svg = button?.querySelector("svg");
    if (!svg) return;
    svg.innerHTML = forward
      ? '<path d="M15 7a7 7 0 1 0 2 10"></path><path d="m15 4 4 3-4 3"></path>'
      : '<path d="M9 7a7 7 0 1 1-2 10"></path><path d="m9 4-4 3 4 3"></path>';
  };
  normalizeSeekIcon(seekBack, false);
  normalizeSeekIcon(seekForward, true);
  const textSource = article.querySelector("[data-article-content]");
  const labels = toolbar?.dataset || {};
  let utterance = null;
  let speechState = "idle";
  let speechText = "";
  let speechOffset = 0;
  let elapsedSeconds = 0;
  let playbackRate = 1;
  let elapsedTimer = null;
  let elapsedTick = 0;

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  const setElapsed = () => { if (elapsed) elapsed.textContent = formatTime(elapsedSeconds); };
  const setStatus = (message) => { if (status) status.textContent = message || ""; };
  const stopElapsedTimer = () => {
    if (elapsedTimer) window.clearInterval(elapsedTimer);
    elapsedTimer = null;
  };
  const startElapsedTimer = () => {
    stopElapsedTimer();
    elapsedTick = Date.now();
    elapsedTimer = window.setInterval(() => {
      const now = Date.now();
      elapsedSeconds += (now - elapsedTick) / 1000;
      elapsedTick = now;
      setElapsed();
    }, 250);
  };

  const articleText = () => {
    if (!textSource) return "";
    const clone = textSource.cloneNode(true);
    clone.querySelectorAll("nav, [data-reading-exclude], .about-section__meta").forEach((node) => node.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
  };

  const calculateReadingTime = () => {
    const text = articleText();
    const language = document.documentElement.lang.toLowerCase();
    const isCjk = language.startsWith("zh") || language.startsWith("ja") || language.startsWith("ko");
    const units = isCjk ? [...text].filter((character) => /[\p{L}\p{N}]/u.test(character)).length : text ? text.split(/\s+/).length : 0;
    const wordsPerMinute = isCjk ? 420 : language.startsWith("vi") ? 210 : 200;
    const minutes = Math.max(1, Math.ceil(units / wordsPerMinute));
    const readingTime = toolbar?.querySelector("[data-reading-time]");
    if (readingTime) readingTime.textContent = `${minutes} ${labels.readingLabel || "min read"}`;
  };

  const updateListenButton = () => {
    if (!listenButton) return;
    const isPaused = speechState === "paused";
    const isSpeaking = speechState === "speaking";
    listenButton.setAttribute("aria-pressed", String(isSpeaking || isPaused));
    listenButton.dataset.state = speechState;
    const label = isPaused ? labels.resumeLabel : isSpeaking ? labels.pauseLabel : labels.listenLabel;
    const text = listenButton.querySelector("[data-listen-label]");
    if (text) text.textContent = label || "Listen to article";
    if (listenIcon) listenIcon.dataset.state = isSpeaking ? "pause" : "play";
  };

  const stopSpeech = (message = "") => {
    utterance = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    stopElapsedTimer();
    speechState = "idle";
    speechOffset = 0;
    elapsedSeconds = 0;
    setElapsed();
    updateListenButton();
    if (message) setStatus(message);
  };

  const startSpeech = (offset = speechOffset) => {
    if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
      listenButton?.setAttribute("disabled", "disabled");
      toolbar?.querySelectorAll("[data-audio-control]").forEach((control) => control.setAttribute("disabled", "disabled"));
      setStatus(labels.unsupportedLabel || "Speech playback is not supported in this browser.");
      return;
    }
    speechText = speechText || articleText();
    if (!speechText) return;
    speechOffset = clamp(Math.floor(offset), 0, Math.max(0, speechText.length - 1));
    window.speechSynthesis.cancel();
    const activeOffset = speechOffset;
    const nextUtterance = new SpeechSynthesisUtterance(speechText.slice(activeOffset));
    nextUtterance.lang = document.documentElement.lang || "en";
    nextUtterance.rate = playbackRate;
    const voices = window.speechSynthesis.getVoices();
    const exactVoice = voices.find((voice) => voice.lang?.toLowerCase() === nextUtterance.lang.toLowerCase());
    const languageVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith(nextUtterance.lang.slice(0, 2).toLowerCase()));
    if (exactVoice || languageVoice) nextUtterance.voice = exactVoice || languageVoice;
    utterance = nextUtterance;
    nextUtterance.onstart = () => {
      if (utterance !== nextUtterance) return;
      speechState = "speaking";
      startElapsedTimer();
      updateListenButton();
    };
    nextUtterance.onboundary = (event) => {
      if (utterance === nextUtterance && Number.isFinite(event.charIndex)) speechOffset = activeOffset + event.charIndex;
    };
    nextUtterance.onend = () => {
      if (utterance !== nextUtterance) return;
      speechOffset = speechText.length;
      utterance = null;
      stopElapsedTimer();
      speechState = "idle";
      updateListenButton();
      setStatus(labels.finishedLabel || "Finished listening.");
    };
    nextUtterance.onerror = () => {
      if (utterance !== nextUtterance) return;
      stopSpeech(labels.unsupportedLabel || "Speech playback is not supported in this browser.");
    };
    speechState = "speaking";
    updateListenButton();
    window.speechSynthesis.speak(nextUtterance);
  };

  const seekBy = (seconds) => {
    speechText = speechText || articleText();
    if (!speechText || speechState === "idle") return;
    const charactersPerSecond = 12 * playbackRate;
    speechOffset = clamp(speechOffset + seconds * charactersPerSecond, 0, Math.max(0, speechText.length - 1));
    elapsedSeconds = clamp(elapsedSeconds + seconds, 0, Number.MAX_SAFE_INTEGER);
    setElapsed();
    startSpeech(speechOffset);
  };

  listenButton?.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) return startSpeech();
    if (speechState === "speaking") {
      window.speechSynthesis.pause();
      stopElapsedTimer();
      speechState = "paused";
      updateListenButton();
      return;
    }
    if (speechState === "paused") {
      window.speechSynthesis.resume();
      startElapsedTimer();
      speechState = "speaking";
      updateListenButton();
      return;
    }
    speechText = articleText();
    speechOffset = 0;
    elapsedSeconds = 0;
    setElapsed();
    startSpeech(0);
  });

  seekBack?.addEventListener("click", () => seekBy(-15));
  seekForward?.addEventListener("click", () => seekBy(15));
  speedButton?.addEventListener("click", () => {
    const rates = [1, 1.25, 1.5, 2];
    playbackRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    speedButton.textContent = `${playbackRate}x`;
    if (speechState !== "idle") startSpeech(speechOffset);
  });

  shareButton?.addEventListener("click", async () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const title = document.title;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: canonical });
        setStatus(labels.sharedLabel || "Link shared.");
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(canonical);
      } else {
        const input = document.createElement("textarea");
        input.value = canonical;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        if (!document.execCommand("copy")) throw new Error("copy failed");
        input.remove();
      }
      setStatus(labels.copiedLabel || "Link copied.");
    } catch {
      setStatus(labels.shareErrorLabel || "Could not share or copy the link.");
    }
  });

  window.addEventListener("pagehide", () => stopSpeech());
  window.addEventListener("beforeunload", () => stopSpeech());
  calculateReadingTime();
  setElapsed();
  updateListenButton();
  if (!("speechSynthesis" in window)) {
    listenButton?.setAttribute("disabled", "disabled");
    toolbar?.querySelectorAll("[data-audio-control]").forEach((control) => control.setAttribute("disabled", "disabled"));
    setStatus(labels.unsupportedLabel || "Speech playback is not supported in this browser.");
  }
})();
