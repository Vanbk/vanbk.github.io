document.documentElement.classList.add('js');

const controls = document.querySelector('.publication-controls');
if (controls) {
  controls.hidden = false;
  const search = document.querySelector('#publication-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const papers = [...document.querySelectorAll('[data-publication]')];
  const count = document.querySelector('#publication-count');
  const empty = document.querySelector('#publication-empty');
  const searchable = papers.map((paper) => ({ paper, text: paper.querySelector('.paper-body').textContent.toLowerCase() + ' ' + paper.querySelector('.paper-year').textContent }));
  let activeFilter = 'all';
  function update() {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const { paper, text } of searchable) {
      const match = (activeFilter === 'all' || paper.dataset.type === activeFilter) && words.every((word) => text.includes(word));
      paper.hidden = !match;
      if (match) visible += 1;
    }
    count.textContent = `${visible} ${visible === 1 ? 'publication' : 'publications'}${visible !== papers.length ? ` of ${papers.length}` : ''} · newest first`;
    empty.hidden = visible !== 0;
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
  }
  filters.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    update();
  }));
  search.addEventListener('input', update);
  document.querySelector('#reset-filters').addEventListener('click', () => {
    activeFilter = 'all';
    search.value = '';
    update();
    search.focus();
  });
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copy);
    const status = button.parentElement.querySelector('.copy-status');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = 'Citation copied.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });
});

document.querySelectorAll('.print-button').forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', () => window.print());
});
