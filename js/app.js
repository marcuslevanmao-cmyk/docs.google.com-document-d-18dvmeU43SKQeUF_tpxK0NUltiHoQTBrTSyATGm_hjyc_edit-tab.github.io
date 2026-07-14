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
      if (action === 'spellcheck' || action === 'paintformat' || action === 'search' ||
          action === 'checklist' || action === 'image' || action === 'dec-size' || action === 'inc-size') {
        return; // visual affordance only in this demo
      }
      if (action === 'forecolor') {
        document.execCommand('foreColor', false, '#d93025');
        return;
      }
      if (action === 'hilitecolor') {
        document.execCommand('hiliteColor', false, '#fff475');
        return;
      }
      if (action === 'link') {
        const url = window.prompt('Paste a link URL:');
        if (url) document.execCommand('createLink', false, url);
        return;
      }
      document.execCommand(action, false, null);
      btn.classList.toggle('active');
    });
  });
}

/** Right column toggles between the idle addon rail and the wide Comments panel. */
function initCommentsPanel() {
  const commentsBtn = document.getElementById('comments-toggle-btn');
  const closeBtn = document.getElementById('comments-close-btn');
  const addonRail = document.getElementById('addon-rail');
  const commentsPanel = document.getElementById('comments-panel');

  function open() {
    AppState.commentsOpen = true;
    addonRail.hidden = true;
    commentsPanel.hidden = false;
    commentsBtn.classList.add('active');
  }
  function close() {
    AppState.commentsOpen = false;
    addonRail.hidden = false;
    commentsPanel.hidden = true;
    commentsBtn.classList.remove('active');
  }

  commentsBtn.addEventListener('click', () => (AppState.commentsOpen ? close() : open()));
  closeBtn.addEventListener('click', close);
}

/** Version history opens a full-screen takeover, matching the reference screenshot. */
function initVersionHistoryView() {
  const historyBtn = document.getElementById('history-toggle-btn');
  const view = document.getElementById('version-history-view');
  const backBtn = document.getElementById('vh-back-btn');
  const titleEl = document.getElementById('vh-title');
  const vhCanvas = document.getElementById('vh-canvas');

  function open() {
    const history = HistoryEngine.getHistory();
    const idx = HistoryEngine.getCurrentIndex();
    const current = history[idx] || history[history.length - 1];

    if (current) {
      titleEl.textContent = `Today, ${HistoryEngine.formatTime(current.timestamp)}`;
      HistoryEngine.renderReadOnlyPages(vhCanvas, current.content);
    } else {
      titleEl.textContent = 'Today';
      vhCanvas.innerHTML = '';
    }

    HistoryEngine.renderVersionList();
    view.hidden = false;
  }

  function close() {
    view.hidden = true;
  }

  historyBtn.addEventListener('click', open);
  backBtn.addEventListener('click', close);
}

function initTabsSidebarToggles() {
  const backBtn = document.getElementById('tabs-back-btn');
  const sidebar = document.getElementById('tabs-sidebar');
  if (backBtn) backBtn.addEventListener('click', () => (sidebar.hidden = true));
}

function initTitleField() {
  const titleInput = document.querySelector('.doc-title');
  titleInput.addEventListener('change', () => {
    document.title = titleInput.value || 'Untitled document';
  });
}

function initRulerMarkers() {
  // Ruler margin markers default to 1in margins already set in CSS;
  // this hook exists so a future drag-to-resize feature has a place to live.
}

function initApp() {
  EditorEngine.initFirstPage();
  CommentsEngine.bindSelectionListener();
  initToolbar();
  initCommentsPanel();
  initVersionHistoryView();
  initTabsSidebarToggles();
  initTitleField();
  initRulerMarkers();

  HistoryEngine.captureSnapshot('Document created');

  window.addEventListener('resize', () => CommentsEngine.renderCommentCards());
}

document.addEventListener('DOMContentLoaded', initApp);
