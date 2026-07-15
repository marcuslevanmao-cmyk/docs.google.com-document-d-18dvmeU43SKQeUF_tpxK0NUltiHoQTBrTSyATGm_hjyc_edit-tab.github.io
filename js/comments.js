// js/comments.js
/**
 * comments.js — Contextual Annotation Engine with Floating Margin Cards
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;
  let activePopup = null;

  // ------------------------------
  // 1. Selection Listener
  // ------------------------------
  function bindSelectionListener() {
    const pagesContainer = document.getElementById('pages-container');
    if (!pagesContainer) return;

    pagesContainer.addEventListener('mouseup', (e) => {
      const page = e.target.closest('.doc-page');
      if (!page) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }

      const range = sel.getRangeAt(0);
      if (!range.toString().trim()) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }

      const container = range.commonAncestorContainer;
      const insidePage = container.nodeType === Node.ELEMENT_NODE
        ? container.closest('.doc-page')
        : container.parentElement?.closest('.doc-page');

      if (insidePage) {
        pendingRange = range.cloneRange();
      } else {
        pendingRange = null;
      }
      reflectAddCommentButtonState();
    });

    // FIXED: Do not clear text selection when clicking comment trigger buttons
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.doc-page') && 
          !e.target.closest('.comment-floating-composer') &&
          !e.target.closest('#add-comment-btn') &&
          !e.target.closest('#comment-btn')) {
        pendingRange = null;
        reflectAddCommentButtonState();
      }
    });
  }

  function reflectAddCommentButtonState() {
    const btn = document.getElementById('add-comment-btn');
    if (btn) btn.disabled = !pendingRange;
  }

  // ------------------------------
  // 2. Floating Composer (Anonymous Profile Update)
  // ------------------------------
  function showFloatingComposer(cid, quote, rangeRect) {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }

    const popup = document.createElement('div');
    popup.className = 'comment-floating-composer';
    
    let left = rangeRect.left + window.scrollX;
    let top = rangeRect.bottom + window.scrollY + 10;
    if (left + 340 > window.innerWidth) left = window.innerWidth - 350;
    if (top + 200 > window.innerHeight) top = rangeRect.top + window.scrollY - 200;

    popup.style.position = 'fixed';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.width = '340px';
    popup.style.zIndex = '1000';

    // UPDATED: Changed user to "You" and added anonymous avatar SVG icon
    popup.innerHTML = `
      <div class="docs-hover-card">
        <div class="card-header">
          <div class="avatar" style="background-color: #5f6368; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C8.66 14 2 15.67 2 19V22H22V19C22 15.67 15.34 14 12 14Z" fill="white"/>
            </svg>
          </div>
          <span class="user-name">You</span>
        </div>
        
        <div class="card-input-container">
          <input type="text" class="docs-pill-input" placeholder="Comment or add others with @">
        </div>
        
        <div class="card-actions">
          <button class="btn-text-cancel">Cancel</button>
          <button class="btn-filled-comment" disabled>Comment</button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    activePopup = popup;

    const textarea = popup.querySelector('.docs-pill-input');
    const commentBtn = popup.querySelector('.btn-filled-comment');
    const cancelBtn = popup.querySelector('.btn-text-cancel');
    
    textarea.focus();

    textarea.addEventListener('input', () => {
      if (textarea.value.trim()) {
        commentBtn.disabled = false;
        commentBtn.classList.add('active');
      } else {
        commentBtn.disabled = true;
        commentBtn.classList.remove('active');
      }
    });

    const cleanUp = () => {
      removeAnchor(cid);
      closePopup();
      pendingRange = null;
      reflectAddCommentButtonState();
    };

    cancelBtn.addEventListener('click', cleanUp);

    commentBtn.addEventListener('click', () => {
      const body = textarea.value.trim();
      if (!body) return;

      const activeTabId = EditorEngine.getActiveTabId();
      const canvasEl = document.getElementById('doc-canvas');
      const canvasRect = canvasEl.getBoundingClientRect();
      const relativeTop = rangeRect.top - canvasRect.top + window.scrollY;

      comments.set(cid, {
        id: cid,
        tabId: activeTabId,
        quote,
        body,
        resolved: false,
        topOffset: relativeTop
      });

      renderCommentCards();
      closePopup();
      pendingRange = null;
      reflectAddCommentButtonState();
    });
  }

  function closePopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  }

  function removeAnchor(cid) {
    document.querySelectorAll(`span[data-comment-id="${cid}"]`).forEach(el => {
      el.replaceWith(...el.childNodes);
    });
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) return;

    const textQuote = pendingRange.toString().trim();
    if (!textQuote) return;

    idCounter++;
    const cid = `comm_${idCounter}_${Date.now().toString().slice(-3)}`;

    const span = document.createElement('span');
    span.className = 'comment-anchor active';
    span.dataset.commentId = cid;

    try {
      pendingRange.surroundContents(span);
    } catch (e) {
      const frag = pendingRange.extractContents();
      span.appendChild(frag);
      pendingRange.insertNode(span);
    }

    const rect = span.getBoundingClientRect();
    window.getSelection().removeAllRanges();
    showFloatingComposer(cid, textQuote, rect);
  }

  // ------------------------------
  // 3. Margin Sidebar Render
  // ------------------------------
  function renderCommentCards() {
    const activeTabId = EditorEngine.getActiveTabId();
    const sidebarList = document.getElementById('comments-list');
    if (!sidebarList) return;
    sidebarList.innerHTML = '';

    const activeComments = [];
    comments.forEach((c, key) => {
      if (!c.resolved && c.tabId === activeTabId) {
        const anchorExists = document.querySelector(`span[data-comment-id="${c.id}"]`);
        if (anchorExists) {
          activeComments.push([key, c]);
        }
      }
    });

    if (activeComments.length === 0) {
      sidebarList.innerHTML = `
        <div class="empty-state">
          <p>Start a discussion</p>
          <button class="primary-add-btn" id="sidebar-add-comment-btn">Add comment</button>
        </div>
      `;
      const addBtn = sidebarList.querySelector('#sidebar-add-comment-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => promptForCommentOnSelection());
      }
      return;
    }

    activeComments.forEach(([key, c]) => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.style.marginBottom = '12px';
      card.style.borderRadius = '8px';
      card.style.border = '1px solid #e0e0e0';
      card.style.padding = '14px';
      card.style.background = '#ffffff';
      
      // UPDATED: Modified sidebar cards to show matching anonymous icons and "You"
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:13px;">
          <div style="width:20px; height:20px; border-radius:50%; background-color:#5f6368; display:flex; align-items:center; justify-content:center;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C8.66 14 2 15.67 2 19V22H22V19C22 15.67 15.34 14 12 14Z" fill="white"/>
            </svg>
          </div>
          <span style="font-weight:500; color:#1f1f1f;">You</span>
          <span style="color:#5f6368; font-size:12px; margin-left:auto;">${new Date().toLocaleDateString()}</span>
        </div>
        <div style="font-style:italic; color:#5f6368; font-size:13px; margin-bottom:6px; background:#f8f9fa; padding:6px 8px; border-left:2px solid #dadce0;">
          “${c.quote}”
        </div>
        <div style="font-size:14px; color:#1f1f1f; margin-bottom:10px;">${c.body}</div>
        <div style="display:flex; gap:12px;">
          <button data-act="resolve" style="background:none; border:none; color:#0b57d0; font-size:12px; font-weight:500; cursor:pointer;">Resolve</button>
          <button data-act="delete" style="background:none; border:none; color:#ea4335; font-size:12px; font-weight:500; cursor:pointer;">Delete</button>
        </div>
      `;

      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
          el.className = 'comment-anchor resolved';
        });
        renderCommentCards();
      });

      card.querySelector('[data-act="delete"]').addEventListener('click', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
          el.replaceWith(...el.childNodes);
        });
        comments.delete(key);
        renderCommentCards();
      });

      sidebarList.appendChild(card);
    });
  }

  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards,
    closePopup
  };
})();
