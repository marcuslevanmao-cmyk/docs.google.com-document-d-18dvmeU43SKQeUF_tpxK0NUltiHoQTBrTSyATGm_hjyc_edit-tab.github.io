/**
 * app.js — App Orchestrator & Rich Interactive Layout Handlers
 */
document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // 1. INITIALIZE EDITOR
    // ============================================================
    EditorEngine.renderTabsSidebar();
    EditorEngine.loadActiveTabContent();
    CommentsEngine.bindSelectionListener();

    // Add tab button
    const addTabBtn = document.getElementById('add-tab-btn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', () => EditorEngine.createNewTab());
    }

    // ============================================================
    // 2. FORMATTING TOOLBAR
    // ============================================================
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

    // ============================================================
    // 3. DROPDOWN CONTROLS
    // ============================================================
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
            let tag = 'p';
            if (e.target.value === 'Heading 1') tag = 'H1';
            else if (e.target.value === 'Heading 2') tag = 'H2';
            else if (e.target.value === 'Heading 3') tag = 'H3';
            
            document.execCommand('formatBlock', false, tag);
            HistoryEngine.captureSnapshot(`Applied style: ${e.target.value}`);
        });
    }

    // ============================================================
    // 4. FONT SIZE CONTROLS
    // ============================================================
    const decBtn = document.getElementById('decrease-size-btn');
    const incBtn = document.getElementById('increase-size-btn');
    const sizeInput = document.querySelector('.font-size-input');

    if (decBtn && incBtn && sizeInput) {
        const applyFontSize = (newSize) => {
            sizeInput.value = newSize;
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && !selection.isCollapsed) {
                try {
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    span.style.fontSize = `${newSize}px`;
                    range.surroundContents(span);
                    HistoryEngine.captureSnapshot(`Changed font size to ${newSize}px`);
                } catch (e) {
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

    // ============================================================
    // 5. COMMENT BUTTON (Toolbar)
    // ============================================================
    const toolbarCommentBtn = document.getElementById('toolbar-comment-btn');
    if (toolbarCommentBtn) {
        toolbarCommentBtn.addEventListener('click', () => CommentsEngine.promptForCommentOnSelection());
    }

    // ============================================================
    // 6. COMMENTS SIDEBAR TOGGLE
    // ============================================================
    const commentBtn = document.getElementById('comment-btn');
    const commentsSidebar = document.getElementById('comments-sidebar');
    const closeCommentsBtn = document.getElementById('close-comments-btn');

    if (commentBtn && commentsSidebar) {
        commentBtn.addEventListener('click', () => {
            // Close history if open
            const vhOverlay = document.getElementById('version-history-view');
            if (vhOverlay) vhOverlay.hidden = true;
            commentsSidebar.hidden = !commentsSidebar.hidden;
        });
    }

    if (closeCommentsBtn && commentsSidebar) {
        closeCommentsBtn.addEventListener('click', () => {
            commentsSidebar.hidden = true;
        });
    }

    // ============================================================
    // 7. VERSION HISTORY TOGGLE
    // ============================================================
    const historyBtn = document.getElementById('history-btn');
    const vhOverlay = document.getElementById('version-history-view');
    const vhBackBtn = document.getElementById('vh-back-btn');

    if (historyBtn && vhOverlay) {
        historyBtn.addEventListener('click', () => {
            // Close comments if open
            if (commentsSidebar) commentsSidebar.hidden = true;
            
            // Show history
            vhOverlay.hidden = false;
            
            // Preview the most recent version
            const history = HistoryEngine.getHistory();
            if (history && history.length > 0) {
                HistoryEngine.previewSnapshot(0);
            }
            renderHistorySidebar();
        });
    }

    if (vhBackBtn && vhOverlay) {
        vhBackBtn.addEventListener('click', () => {
            vhOverlay.hidden = true;
        });
    }

    // ============================================================
    // 8. RESTORE MODAL
    // ============================================================
    const confirmModal = document.getElementById('confirm-modal');
    const restoreTriggerBtn = document.getElementById('vh-restore-trigger-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    if (restoreTriggerBtn && confirmModal) {
        restoreTriggerBtn.addEventListener('click', () => {
            confirmModal.hidden = false;
        });
    }

    if (modalCancelBtn && confirmModal) {
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

    // ============================================================
    // 9. INITIAL SNAPSHOT
    // ============================================================
    HistoryEngine.captureSnapshot('Document session opened');
});
