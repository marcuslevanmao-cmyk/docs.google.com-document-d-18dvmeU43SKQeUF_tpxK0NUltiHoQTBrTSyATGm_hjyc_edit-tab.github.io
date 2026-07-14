/**
 * editor.js — Multi-Tab Architecture with Live Custom Renaming Engine
 */
const EditorEngine = (() => {
  const documentTabs = [
    {
      id: "tab_1",
      title: "The Wasted Potential of Religion",
      htmlContent: initialDocContent
    }
  ];
  let activeTabId = "tab_1";

  function createNewTab() {
    const id = `tab_${Date.now()}`;
    const newTab = {
      id: id,
      title: `Untitled Tab`,
      htmlContent: `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;"><p>Start writing here...</p></div>`
    };
    documentTabs.push(newTab);
    activeTabId = id;
    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot('Created a new tab');
  }

  function deleteTab(id, event) {
    if (event) event.stopPropagation();
    if (documentTabs.length <= 1) return;

    const idx = documentTabs.findIndex(t => t.id === id);
    if (idx === -1) return;

    documentTabs.splice(idx, 1);
    if (activeTabId === id) {
      activeTabId = documentTabs[Math.max(0, idx - 1)].id;
    }

    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot('Deleted a tab');
  }

  function renderTabsSidebar() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    container.innerHTML = '';

    documentTabs.forEach(tab => {
      const isActive = tab.id === activeTabId;
      const row = document.createElement('div');
      row.className = `tab-item-row ${isActive ? 'active' : ''}`;
      row.dataset.tabId = tab.id;

      row.innerHTML = `
        <input type="text" class="tab-name-input" value="${tab.title}" 
               ${isActive ? '' : 'readonly'} 
               title="Double-click to rename" />
        ${documentTabs.length > 1 ? '<button class="tab-close-btn" title="Delete tab">×</button>' : ''}
      `;

      row.addEventListener('click', () => {
        if (activeTabId === tab.id) return;
        activeTabId = tab.id;
        renderTabsSidebar();
        loadActiveTabContent();
      });

      const input = row.querySelector('.tab-name-input');
      input.addEventListener('change', () => {
        tab.title = input.value;
        // Update document title input at top header of the workspace
        const docTitleInput = document.querySelector('.doc-title');
        if (docTitleInput && isActive) {
          docTitleInput.value = tab.title;
        }
        HistoryEngine.captureSnapshot(`Renamed tab to "${tab.title}"`);
      });

      if (documentTabs.length > 1) {
        row.querySelector('.tab-close-btn').addEventListener('click', (e) => deleteTab(tab.id, e));
      }

      container.appendChild(row);
    });
  }

  function loadActiveTabContent() {
    const target = document.getElementById('pages-container');
    if (!target) return;
    target.innerHTML = '';

    const tab = documentTabs.find(t => t.id === activeTabId);
    if (!tab) return;

    // Synchronize top toolbar document title as well!
    const docTitleInput = document.querySelector('.doc-title');
    if (docTitleInput) {
        docTitleInput.value = tab.title;
    }

    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    page.innerHTML = tab.htmlContent;

    page.addEventListener('input', () => {
      tab.htmlContent = page.innerHTML;
      HistoryEngine.scheduleSnapshot('Auto-saved layout edit');
    });

    target.appendChild(page);
    
    const pageNum = document.createElement('div');
    pageNum.className = 'page-number';
    pageNum.textContent = '1';
    target.appendChild(pageNum);

    // Refresh dynamic comments specifically matching this tab!
    CommentsEngine.renderCommentCards();
  }

  return {
    getTabs() { return documentTabs; },
    getActiveTabId() { return activeTabId; },
    createNewTab,
    renderTabsSidebar,
    loadActiveTabContent
  };
})();
