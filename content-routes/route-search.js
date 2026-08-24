(() => {
  const input = document.querySelector('[data-route-search]');
  const results = document.querySelector('[data-search-results]');
  if (!input || !results) return;
  const items = [
    { url: '/blog/', title: 'Blog', description: 'Notes and updates from Navin Research.', terms: 'blog notes updates' },
    { url: '/research/', title: 'Research', description: 'Research directions and methods from Navin Research.', terms: 'research methods language speech vision' },
    { url: '/docs/', title: 'Docs', description: 'Practical documentation for published work and tools.', terms: 'docs documentation tools' },
    { url: '/search/', title: 'Search', description: 'Search the public route directory.', terms: 'search directory' },
    { url: '/vi/blog/', title: 'Blog (Tiếng Việt)', description: 'Ghi chú và cập nhật từ Navin Research.', terms: 'blog ghi chú cập nhật' },
    { url: '/vi/research/', title: 'Nghiên cứu', description: 'Định hướng và phương pháp nghiên cứu.', terms: 'nghiên cứu phương pháp ngôn ngữ tiếng nói thị giác' },
    { url: '/vi/docs/', title: 'Tài liệu', description: 'Tài liệu thực hành cho công trình và công cụ đã công bố.', terms: 'tài liệu công cụ' },
    { url: '/zh-cn/blog/', title: '博客（简体中文）', description: 'Navin Research 的笔记与更新。', terms: '博客 笔记 更新' },
    { url: '/zh-cn/research/', title: '研究', description: 'Navin Research 的研究方向与方法。', terms: '研究 方法 语言 语音 视觉' },
    { url: '/zh-cn/docs/', title: '文档', description: '已发布工作与工具的实用文档。', terms: '文档 工具' }
  ];
  const render = () => {
    const query = input.value.trim().toLocaleLowerCase();
    const matches = query ? items.filter(item => `${item.title} ${item.description} ${item.terms}`.toLocaleLowerCase().includes(query)) : items;
    results.innerHTML = matches.length ? matches.map(item => `<article class="route-search__result"><h2><a href="${item.url}">${item.title}</a></h2><p>${item.description}</p></article>`).join('') : '<p class="route-search__empty">No matching route metadata was found.</p>';
  };
  input.addEventListener('input', render);
  render();
})();
