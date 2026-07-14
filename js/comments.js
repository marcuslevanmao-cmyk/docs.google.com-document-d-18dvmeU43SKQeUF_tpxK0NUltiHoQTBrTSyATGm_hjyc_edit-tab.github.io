/**
 * comments.js — The Annotation Engine
 * Uses transactional Range extractions to build resilient highlight layers.
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;

  function bindSelectionListener() {
    const cv = document.getElementById('doc-canvas');
    if (!cv) return;

    document.addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!range.toString().trim()) return;

      const node = range.commonAncestorContainer;
      const insidePage = node.nodeType === Node.ELEMENT_NODE ? node.closest('.doc-page') : node.parentElement?.closest('.doc-page');
      
      if (insidePage) {
        pendingRange = range.cloneRange();
      }
    });
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) {
      alert('Highlight a text block inside your document sheet layout first!');
      return;
    }

    const bodyText = window.prompt('Enter comment:');
    if (!bodyText || !bodyText.trim()) return;

    idCounter++;
    const cid = `comm_${idCounter}_${Date.now().toString().slice(-3)}`;
    const textQuote = pendingRange.toString();

    const span = document.createElement('span');
    span.className = 'comment-anchor active';
    span.dataset.commentId = cid;

    try {
      pendingRange.surroundContents(span);
    } catch (e) {
      // Robust structural fallback if highlighting cuts across existing strong/em inline wrappers
      const frag = pendingRange.extractContents();
      span.appendChild(frag);
      pendingRange.insertNode(span);
    }

    comments.set(cid, { id: cid, quote: textQuote, body: bodyText.trim(), resolved: false });
    pendingRange = null;
    window.getSelection().removeAllRanges();
    renderCommentCards();
  }

  function renderCommentCards() {
    const list = document.getElementById('comments-list');
    if (!list) return;
    list.innerHTML = '';

    comments.forEach(c => {
      if (c.resolved) return;
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">U</div>
          <span class="comment-author">You</span>
        </div>
        <p class="comment-quote">"${c.quote}"</p>
        <p class="comment-body">${c.body}</p>
        <div class="comment-actions">
          <button data-act="resolve">Resolve</button>
        </div>
      `;
      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.className = 'comment-anchor resolved');
        card.remove();
      });
      list.appendChild(card);
    });
  }

  return { bindSelectionListener, promptForCommentOnSelection, renderCommentCards };
})();
