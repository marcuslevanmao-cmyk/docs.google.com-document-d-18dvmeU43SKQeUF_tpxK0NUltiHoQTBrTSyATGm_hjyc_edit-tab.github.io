/**
 * history.js — Complete Version History Engine
 * Replicating Marcus le van mao's 8 essay drafts
 */
const HistoryEngine = (() => {
  const authorName = "Marcus le van mao";

  // --- Full Essay Content ---
  const finalEssay = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>
  <p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. By embedding moral expectations in divine narratives, religions ensured compliance and cooperation in early societies where formal laws were weak. These shared beliefs acted as a social glue, aligning the goals of individuals with the survival of the group.</p>
  <p>Yet, the rigid dogmas that ensure cohesion can also stifle progress. When religious doctrines are held as absolute, they inevitably clash with scientific discovery and philosophical inquiry. The historical resistance to heliocentrism or evolutionary theory illustrates how the demand for certainty can hinder the pursuit of truth.</p>
  <p>Ultimately, the value of religion lies not in its cosmological accuracy, but in its psychological and sociological utility. As society modernizes, the challenge is to preserve the community-building and ethically grounding aspects of religious tradition while discarding the dogma that divides us.</p>
</div>`;

  const brainstormContent = `<div style="font-family: Arial, sans-serif; font-size: 14px;">
  <h3>Brainstorming: The Utility of Gods</h3>
  <ul>
    <li><strong>Core Question:</strong> Why did everyone invent gods?</li>
    <li><strong>Pros:</strong> Social glue, shared morals, community support, easier to teach ethics through stories (parables).</li>
    <li><strong>Cons:</strong> Dogmatism, rejecting science (Galileo, evolution), us-vs-them mentality.</li>
    <li><strong>Thesis:</strong> Measure religion by the people it creates, not the supernatural truth of it.</li>
  </ul>
</div>`;

  // --- 8 Historical States (Newest to Oldest) ---
  let historyData = [
    {
      id: "v8", timestamp: "July 15, 1:00 PM", label: "Final Polish & Formatting", author: authorName,
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: finalEssay },
        { id: "tab_2", title: "Brainstorm", content: brainstormContent }
      ]
    },
    {
      id: "v7", timestamp: "July 15, 12:30 PM", label: "Refining the Conclusion", author: authorName,
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: finalEssay.replace("As society modernizes, the challenge is", "We need to try") },
        { id: "tab_2", title: "Brainstorm", content: brainstormContent }
      ]
    },
    {
      id: "v6", timestamp: "July 15, 11:45 AM", label: "Adding Counter-arguments (Science)", author: authorName,
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: `<div style="font-family: Arial, sans-serif; font-size: 16px;"><p>Across history, civilizations around the world have independently developed religious traditions... The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables.</p><p>Yet, the rigid dogmas that ensure cohesion can also stifle progress. When religious doctrines are held as absolute, they inevitably clash with scientific discovery and philosophical inquiry.</p></div>` },
        { id: "tab_2", title: "Brainstorm", content: brainstormContent }
      ]
    },
    {
      id: "v5", timestamp: "July 15, 11:00 AM", label: "Expanding on Christianity & Morals", author: authorName,
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: `<div style="font-family: Arial, sans-serif; font-size: 16px;"><p>Across history, civilizations around the world have independently developed religious traditions... The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables.</p></div>` },
        { id: "tab_2", title: "Brainstorm", content: brainstormContent }
      ]
    },
    {
      id: "v4", timestamp: "July 15, 10:15 AM", label: "First Paragraph Draft", author: authorName,
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: `<div style="font-family: Arial, sans-serif; font-size: 16px;"><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature. Religion has been one of humanity's most effective systems for organizing communities.</p></div>` },
        { id: "tab_2", title: "Brainstorm", content: brainstormContent }
      ]
    },
    {
      id: "v3", timestamp: "July 15, 9:45 AM", label: "Brainstorming & Outline", author: authorName,
      tabsState: [
        { id: "tab_1", title: "Untitled Document", content: `<div><br></div>` },
        { id: "tab_2", title: "Brainstorm", content: brainstormContent }
      ]
    },
    {
      id: "v2", timestamp: "July 15, 9:15 AM", label: "Initial Thoughts", author: authorName,
      tabsState: [
        { id: "tab_1", title: "Untitled Document", content: `<div><br></div>` },
        { id: "tab_2", title: "Untitled Document", content: `<div>Why religion? Good for society, bad for science maybe?</div>` }
      ]
    },
    {
      id: "v1", timestamp: "July 15, 9:00 AM", label: "Created Document", author: authorName,
      tabsState: [
        { id: "tab_1", title: "Untitled Document", content: `<div><br></div>` }
      ]
    }
  ];

  let selectedIndex = 0;

  // --- Internal Methods ---
  function renderHistorySidebar() {
    const list = document.getElementById('version-list');
    if (!list) return;
    list.innerHTML = '';

    historyData.forEach((state, index) => {
      const item = document.createElement('div');
      item.style.padding = '12px';
      item.style.borderBottom = '1px solid var(--border-subtle)';
      item.style.cursor = 'pointer';
      item.style.backgroundColor = index === selectedIndex ? '#e8f0fe' : 'transparent';
      
      item.innerHTML = `
        <div style="font-weight: ${index === selectedIndex ? 'bold' : 'normal'}; color: var(--text-primary); margin-bottom: 4px;">${state.timestamp}</div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">${state.label}</div>
        <div style="font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #9c27b0;"></div>
          ${state.author}
        </div>
      `;
      
      item.addEventListener('click', () => {
        selectedIndex = index;
        renderHistorySidebar();
        previewSnapshot(index);
      });
      list.appendChild(item);
    });
  }

  // --- Exposed Engine API ---
  function previewSnapshot(index) {
    const previewBox = document.getElementById('vh-page-preview-box');
    if (!previewBox || !historyData[index]) return;
    
    // We display Tab 1 by default in the preview pane
    const primaryTab = historyData[index].tabsState[0];
    previewBox.innerHTML = primaryTab ? primaryTab.content : '<div>No content</div>';
  }

  function getSelectedPreviewIndex() {
    return selectedIndex;
  }

  function rollbackTo(index) {
    const targetState = historyData[index];
    if (!targetState) return;

    // Use window.restoreFullDocumentState if it exists globally, otherwise modify localStorage
    if (typeof window.restoreFullDocumentState === 'function') {
      window.restoreFullDocumentState(targetState.tabsState);
    } else {
      localStorage.setItem('docs_tab_contents', JSON.stringify(targetState.tabsState));
      location.reload(); // Quick refresh to apply states smoothly without breaking EditorEngine
    }
  }

  function captureSnapshot(label) {
    if (typeof EditorEngine === 'undefined') return;
    
    const newSnapshot = {
      id: `v_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      label: label || 'Manual Edit',
      author: authorName,
      tabsState: JSON.parse(JSON.stringify(EditorEngine.getTabs())) // Deep copy current tabs
    };
    
    historyData.unshift(newSnapshot);
    selectedIndex = 0;
    renderHistorySidebar();
  }

  // Auto-init visual selection
  document.addEventListener('DOMContentLoaded', () => {
      previewSnapshot(0);
  });

  return {
    previewSnapshot,
    getSelectedPreviewIndex,
    rollbackTo,
    captureSnapshot,
    renderHistorySidebar // Exposing for app.js to call directly
  };
})();
