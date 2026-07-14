/**
 * comments.js — The Annotation Engine
 * Binds dynamic textual ranges directly to UI components on the right margin.
 */

const CommentsEngine = (() => {
  const comments = new Map(); // id -> { id, quote, body, top, resolved }
  let pendingRange = null;
  let idCounter = 0;

  function nextId() {
    idCounter += 1;
    return `xyz_${idCounter}${Date.now().toString().slice(-4)}`;
  }

  /** Selection Listener: catches mouseup to intercept highlighted ranges inside pages. */
  function bindSelectionListener() {
    document.getElementById('doc-canvas').addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }
      const range = sel.getRangeAt(0);
      if (range.toString().trim() === '') {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }
      
      const container = range.commonAncestorContainer;
      const page = container.nodeType === Node.ELEMENT_NODE
        ? container.closest('.doc-page')
        : container.parentElement && container.parentElement.closest('.doc-page');
      
      if (!page) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }
      
      pendingRange = range.cloneRange();
      reflectAddCommentButtonState();
    });
  }

  function reflectAddCommentButtonState() {
    // Optionally enable/disable the add comment toolbar button here based on pendingRange
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Wraps the selected text in a yellow highlight span
  function wrapCommentRange(range, commentId) {
    const span = document.createElement('span');
    span.className = 'comment-anchor active'; 
    span.dataset.commentId = commentId; 
    
    try {
      range.surroundContents(span);
    } catch (e) {
      console.warn("Could not wrap selection cleanly. Selection likely spans multiple elements.");
    }
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) {
      alert('Select some text first, then click the comment button.');
      return;
    }
    const bodyText = window.prompt('Add a comment:');
    if (bodyText && bodyText.trim()) {
      const newCommentId = nextId();
      
      // Inject visual highlight into the DOM
      wrapCommentRange(pendingRange, newCommentId);
      
      // Add to internal state
      comments.set(newCommentId, {
        id: newCommentId,
        quote: pendingRange.toString(),
        body: bodyText.trim(),
        resolved: false
      });
      
      pendingRange = null;
      renderCommentCards();
    }
  }

  function renderCommentCards() {
    // Implement rendering logic for right margin panel
    console.log("Rendering cards for: ", comments);
  }

  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards
  };
})();
