/**
 * editor.js — Multi-Tab Architecture with Pagination
 */
const EditorEngine = (() => {
  // ─── CHANGE HERE: Load from localStorage if it exists, otherwise use defaults ───
  let documentTabs = [];
  try {
    const savedTabs = localStorage.getItem('docs_tab_contents');
    if (savedTabs) {
      documentTabs = JSON.parse(savedTabs);
    }
  } catch (e) {
    console.error("Failed to parse saved tabs", e);
  }

  // Fallback defaults if localStorage is empty
  if (!documentTabs || documentTabs.length === 0) {
    documentTabs = [
      {
        id: "tab_1",
        title: "The Utility of Gods",
        htmlContent: `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
    <p>Across history, civilizations around the world have independently developed religious traditions...</p>` // Your original full essay text here
      }
    ];
  }

  // Keep the rest of your private variables intact...
  let activeTabId = documentTabs[0]?.id || "tab_1"; 
  
  // ... (Keep all your existing functions: renderTabsSidebar, checkAndPaginate, etc.) ...

  // ─── ENHANCE THIS FUNCTION: Ensure it saves to storage on changes ───
  function saveCurrentTabContent() {
    const tab = documentTabs.find(t => t.id === activeTabId);
    if (tab) {
      tab.htmlContent = getCombinedHtml();
    }
    localStorage.setItem('docs_tab_contents', JSON.stringify(documentTabs));
  }

  // Expose documentTabs via public API so comments.js can see it safely
  return {
    getTabs: () => documentTabs,
    getActiveTabId: () => activeTabId,
    saveCurrentTabContent,
    loadActiveTabContent,
    renderTabsSidebar,
    createNewTab,
    switchTab,
    deleteTab
  };
})();
