/**
 * editor.js — The Core Editor Engine
 * Manages document canvas state lifecycle and structural rendering hooks.
 */
const EditorEngine = (() => {
  const canvas = () => document.getElementById('doc-canvas');

  function createPageElement() {
    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    
    // Inject sample native copy if first instantiation cycle to prevent empty screens
    page.innerHTML = `<div>Stoicism was founded in Athens by Zeno of Citium around 300 BC. It teaches that virtue (such as wisdom) is happiness and judgment should be based on behavior rather than words.</div>`;
    return page;
  }

  function createPageNumberElement(current) {
    const el = document.createElement('div');
    el.className = 'page-number';
    el.textContent = `${current}`;
    return el;
  }

  function initFirstPage() {
    const cv = canvas();
    if (!cv || cv.querySelector('.doc-page')) return;
    
    const page = createPageElement();
    cv.appendChild(page);
    cv.appendChild(createPageNumberElement(1));
  }

  return {
    initFirstPage
  };
})();
