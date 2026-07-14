/**
 * app.js — App Orchestrator & Rich Interactive Layout Handlers
 */
document.addEventListener('DOMContentLoaded', () => {
  EditorEngine.renderTabsSidebar();
  EditorEngine.loadActiveTabContent();
  CommentsEngine.bindSelectionListener();

  const addTabBtn = document.getElementById('add-tab-btn');
  if (addTabBtn) {
    addTabBtn.addEventListener('click', () => EditorEngine.createNewTab());
  }

  // Connect formatting toolbar action listeners
  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      
      if (action === 'bold' || action === 'italic' || action === 'underline') {
        document.execCommand(action, false, null);
        HistoryEngine.captureSnapshot(`Format modifier applied: ${action}`);
      } else if (action === 'undo' || action === 'redo') {
        document.execCommand(action, false, null);
      } else if (action === 'justifyleft' || action === 'justifycenter' || action === 'justifyright') {
        document.execCommand(action, false, null);
        HistoryEngine.captureSnapshot(`Alignment format changed`);
      } else if (action === 'forecolor') {
        document.execCommand('foreColor', false, '#ea4335');
        HistoryEngine.captureSnapshot(`Changed text color to red`);
      } else if (action === 'hilitecolor') {
        document.execCommand('hiliteColor', false, '#fff475');
        HistoryEngine.captureSnapshot(`Applied text highlight tint`);
      }
    });
  });

  // --- NEW: Dropdown Listeners ---
  const fontSelect = document.querySelector('select[title="Font"]');
  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      document.execCommand('fontName', false, e.target.value);
      HistoryEngine.captureSnapshot(`Changed font to ${e.target.value}`);
    });
  }

  const styleSelect = document.querySelector('select[title="Styles"]');
  if (styleSelect) {
    styleSelect.addEventListener('change', (e) => {
      let tag = 'p'; // Default to normal text
      if (e.target.value === 'Heading 1') tag = 'H1';
      if (e.target.value === 'Heading 2') tag = 'H2';
      if (e.target.value === 'Heading 3') tag = 'H3';
      
      document.execCommand('formatBlock', false, tag);
      HistoryEngine.captureSnapshot(`Applied style: ${e.target.value}`);
    });
  }

  // --- NEW: Font Size Control Listeners ---
  const decBtn = document.getElementById('decrease-size-btn');
  const incBtn = document.getElementById('increase-size-btn');
  const sizeInput = document.querySelector('.font-size-input');

  if (decBtn && incBtn && sizeInput) {
    const applyFontSize = (newSize) => {
      sizeInput.value = newSize;
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = `${newSize}px`;
        try {
          range.surroundContents(span);
          HistoryEngine.captureSnapshot(`Changed font size to ${newSize}px`);
        } catch (e) {
          // Fallback structure to replace native formatting tags if multi-line is highlighted
          document.execCommand('fontSize', false, '3');
          const fontElements = document.getElementsByTagName("font");
          for (let i = 0; i < fontElements.length; i++) {
            if (fontElements[i].size === "3") {
              fontElements[i].removeAttribute("size");
              fontElements[i].style.fontSize = `${newSize}px`;
            }
          }
          HistoryEngine.captureSnapshot(`Changed font size to ${newSize}px`);
        }
      }
    };

    decBtn.addEventListener('click', () => {
      let size = parseInt(sizeInput.value) || 11;
      if (size > 6) applyFontSize(size - 1);
    });

    incBtn.addEventListener('click', () => {
      let size = parseInt(sizeInput.value) || 11;
      if (size < 72) applyFontSize(size + 1);
    });

    sizeInput.addEventListener('change', () => {
      let size = parseInt(sizeInput.value) || 11;
      if (size >= 6 && size <= 72) {
        applyFontSize(size);
      }
    });
  }

  // Comment Creation Handler
  const commentBtn = document.getElementById('toolbar-comment-btn');
  if (commentBtn) {
    commentBtn.addEventListener('click', () => CommentsEngine.promptForCommentOnSelection());
  }

  // Version History Engine Wire-up
  const historyBtn = document.getElementById('history-btn');
  const vhOverlay = document.getElementById('version-history-view');
  const vhBackBtn = document.getElementById('vh-back-btn');
  
  const confirmModal = document.getElementById('confirm-modal');
  const restoreTriggerBtn = document.getElementById('vh-restore-trigger-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  if (historyBtn && vhOverlay) {
    historyBtn.addEventListener('click', () => {
      HistoryEngine.previewSnapshot(0);
      vhOverlay.hidden = false;
    });
  }

  if (vhBackBtn && vhOverlay) {
    vhBackBtn.addEventListener('click', () => {
      vhOverlay.hidden = true;
    });
  }

  if (restoreTriggerBtn && confirmModal) {
    restoreTriggerBtn.addEventListener('click', () => {
      confirmModal.hidden = false;
    });
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      confirmModal.hidden = true;
    });
  }

  if (modalConfirmBtn && vhOverlay && confirmModal) {
    modalConfirmBtn.addEventListener('click', () => {
      const targetIdx = HistoryEngine.getSelectedPreviewIndex();
      if (targetIdx !== -1) {
        HistoryEngine.rollbackTo(targetIdx);
      }
      confirmModal.hidden = true;
      vhOverlay.hidden = true; 
    });
  }

  HistoryEngine.captureSnapshot('Document session opened');
});
