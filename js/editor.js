/**
 * editor.js — The Core Editor Engine
 * Manages structural document integrity during runtime data entry.
 */

const EditorEngine = (() => {
  const canvas = () => document.getElementById('doc-canvas');
  let overflowCheckQueued = false;

  function createPageElement() {
    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    attachPageListeners(page);
    return page;
  }

  function createPageNumberElement(current, total) {
    const el = document.createElement('div');
    el.className = 'page-number';
    el.textContent = `${current}`;
    el.dataset.pageNumber = 'true';
    return el;
  }

  function attachPageListeners(page) {
    page.addEventListener('input', () => queueOverflowCheck(page));
    page.addEventListener('keydown', (e) => handleBoundaryKeys(e, page));
    page.addEventListener('focus', () => (page.dataset.focused = 'true'));
  }

  // Helpers to save/restore cursor to prevent typing jumps
  function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      return sel.getRangeAt(0).cloneRange();
    }
    return null;
  }

  function restoreSelection(range) {
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  /** Debounce overflow checks to the next animation frame so rapid typing stays smooth. */
  function queueOverflowCheck(page) {
    if (overflowCheckQueued) return;
    overflowCheckQueued = true;
    
    // Save the cursor position BEFORE any DOM manipulation
    const savedRange = saveSelection();

    requestAnimationFrame(() => {
      overflowCheckQueued = false;
      
      // Perform your overflow logic here (e.g., checking if scrollHeight > clientHeight)
      // Example:
      // if (page.scrollHeight > 1056) { handlePagination(); }

      // Restore the cursor position AFTER manipulation is done
      restoreSelection(savedRange);
    });
  }

  function buildTemplatePills() {
    const wrap = document.createElement('div');
    wrap.className = 'template-pills';
    wrap.contentEditable = 'false'; // Keep pills out of user text flow
    wrap.innerHTML = `
      <button class="template-pill" type="button" data-pill="meeting">
        Meeting notes
      </button>
    `;
    return wrap;
  }

  function removeTemplatePills(page) {
    const pills = page.querySelector('.template-pills');
    if (pills) pills.remove();
  }

  function initFirstPage() {
    const page = createPageElement();
    canvas().appendChild(page);
    canvas().appendChild(createPageNumberElement(1, 1));

    const pills = buildTemplatePills();
    page.appendChild(pills);

    // The pills are a blank-doc affordance only; remove them the moment real content appears.
    page.addEventListener('input', () => removeTemplatePills(page), { once: true });
  }

  return {
    initFirstPage
  };
})();
