/**
 * app.js — Core app initialization and global state manager.
 * Wires the editor, comments, and history engines to the DOM chrome.
 */

const AppState = {
  commentsOpen: false,
};

function initToolbar() {
  document.querySelectorAll('.toolbar-btn[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      if (action === 'comment') {
        CommentsEngine.promptForCommentOnSelection();
        return;
      }
      if (action === 'undo' || action === 'redo') {
        document.execCommand(action);
        return;
      }
      if (action === 'print') {
        window.print();
        return;
      }
    });
  });
}

function initCommentsPanel() {
  // Safe empty hook placeholder for layout pipeline tracking
}

function initVersionHistoryView() {
  const view = document.getElementById('version-history-view');
  const historyBtn = document.getElementById('history-open-btn');
  const backBtn = document.getElementById('vh-back-btn');
  const vhCanvas = document.getElementById('vh-canvas');
  const titleEl = document.getElementById('vh-title-date');

  function open() {
    const history = HistoryEngine.getHistory ? HistoryEngine.getHistory() : [];
    const idx = HistoryEngine.getCurrentIndex ? HistoryEngine.getCurrentIndex() : -1;
    const current = history[idx];

    if (current && titleEl && vhCanvas) {
      titleEl.textContent = `Today, ${HistoryEngine.formatTime(current.timestamp)}`;
      HistoryEngine.renderReadOnlyPages(vhCanvas, current.content);
    } else if (titleEl) {
      titleEl.textContent = 'Today';
    }

    if (HistoryEngine.renderVersionList) {
      HistoryEngine.renderVersionList();
    }
    view.hidden = false;
  }

  function close() {
    view.hidden = true;
  }

  if (historyBtn) historyBtn.addEventListener('click', open);
  if (backBtn) backBtn.addEventListener('click', close);
}

function initTabsSidebarToggles() {
  const backBtn = document.getElementById('tabs-back-btn');
  const sidebar = document.getElementById('tabs-sidebar');
  if (backBtn && sidebar) {
    backBtn.addEventListener('click', () => {
      // Kept open by default for structural stability
    });
  }
}

function initTitleField() {
  const titleInput = document.querySelector('.doc-title');
  if (titleInput) {
    titleInput.addEventListener('change', () => {
      document.title = titleInput.value || 'Untitled document';
    });
  }
}

function initRulerMarkers() {
  // Margin marker defaults hooks placeholder block
}

function initApp() {
  // Trigger original clean boot sequences
  EditorEngine.initFirstPage();
  CommentsEngine.bindSelectionListener();
  initToolbar();
  initCommentsPanel();
  initVersionHistoryView();
  initTabsSidebarToggles();
  initTitleField();
  initRulerMarkers();

  if (HistoryEngine.captureSnapshot) {
    HistoryEngine.captureSnapshot('Document created');
  }
}

document.addEventListener('DOMContentLoaded', initApp);
