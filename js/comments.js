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
  // 1. Selection Listener (attached to the editable page via delegation)
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

    // Clear selection when clicking outside the page
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.doc-page') && !e.target.closest('.comment-floating-composer')) {
        pendingRange = null;
        reflectAddCommentButtonState();
      }
    });
  }

  function reflectAddCommentButtonState() {
    // FIXED: Changed from 'toolbar-comment-btn' to match index.html
    const btn = document.getElementById('add-comment-btn'); 
    if (btn) btn.disabled = !pendingRange;
  }

  // ------------------------------
  // 2. Floating Composer
  // ------------------------------
  function showFloatingComposer(cid, quote, rangeRect) {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }

    const popup = document.createElement('div');
    popup.className = 'comment-floating-composer';
    
    // FIXED: Uses 'absolute' positioning with scroll offsets to anchor cleanly to the layout
    let left = rangeRect.left + window.scrollX;
    let top = rangeRect.bottom + window.scrollY + 10;
    
    if (rangeRect.left + 340 > window.innerWidth) {
      left = window.innerWidth + window.scrollX - 350;
    }
    if (rangeRect.bottom + 200 > window.innerHeight) {
      top = rangeRect.top + window.scrollY - 210;
    }

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';

    popup.innerHTML = `
      <div class="docs-hover-card">
        <div class="card-header">
          <div class="avatar">M</div>
          <span class="user-name">Marcus Le Van Mao élève</span>
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

      // Remove the vibrant temporary '.active' highlight color state from text anchor
      document.querySelectorAll(`span[data-comment-id="${cid}"]`).forEach(el => {
        el.classList.remove('active');
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
  // 3. Hanging Margin Cards Render
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
      
      // FIXED: Removed ugly inline style injections to let the stylesheet handle the design layout
      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">Y</div>
          <span class="comment-author">You</span>
          <span class="comment-date" style="margin-left: auto; font-size: 12px; color: var(--text-secondary, #5f6368);">${new Date().toLocaleDateString()}</span>
        </div>
        <div class="comment-quote">
          “${c.quote}”
        </div>
        <div class="comment-body">${c.body}</div>
        <div class="comment-actions">
          <button data-act="resolve">Resolve</button>
          <button data-act="delete" class="delete-btn">Delete</button>
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
