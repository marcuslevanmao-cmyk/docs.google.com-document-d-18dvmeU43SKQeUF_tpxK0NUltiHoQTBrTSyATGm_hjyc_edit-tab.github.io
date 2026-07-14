// history.js — Complete Version History Engine with localStorage persistence

// ============================================================
// 1. CONTENT DEFINITIONS
// ============================================================

const outlineContent = `<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>`;
const introContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature.</p>`;
const bodyContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p><p>Religion has long served as one of humanity's most influential systems for moral education.</p>`;
const finalContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><br><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables...</p>`;
const brainstormContent = `<h2>Brainstorming Notes</h2><ul><li><b>Theme:</b> Utility vs Truth</li><li><b>Key thinkers:</b> Durkheim, Haidt</li></ul>`;

// The full final essay (the complete version) – to be used for id:9
const fullEssayContent = `<h2>The Wasted Potential of Religion</h2>
<p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature: our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength—its ability to create cohesive communities—can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>

<p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in <em>The Righteous Mind</em> that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p>

<p>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.</p>`;

// ============================================================
// 2. HISTORY DATA — with new entry for May 17
// ============================================================

// Default initial history (used if nothing in localStorage)
const defaultHistory = [
    {
        id: 9,
        dateObj: new Date('2026-05-17T14:00:00'),
        displayDate: "May 17, 2:00 p.m.",
        dayGroup: "Sunday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Completed full essay",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: fullEssayContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 8,
        dateObj: new Date('2026-05-15T16:00:00'),
        displayDate: "May 15, 4:00 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Format modifier applied",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 7,
        dateObj: new Date('2026-05-02T15:30:00'),
        displayDate: "May 2, 3:30 p.m.",
        dayGroup: "Saturday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Grammar and spelling fixes",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent.replace("civilizations", "civilisations") },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 6,
        dateObj: new Date('2026-05-01T14:30:00'),
        displayDate: "May 1, 2:30 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Expanded body with examples",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent + "<p>Studies show religious communities report stronger social support...</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 5,
        dateObj: new Date('2026-05-01T11:45:00'),
        displayDate: "May 1, 11:45 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted final paragraphs",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent + "<p>...and thus religion remains vital.</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 4,
        dateObj: new Date('2026-05-01T10:30:00'),
        displayDate: "May 1, 10:30 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted body paragraphs",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 3,
        dateObj: new Date('2026-05-01T09:15:00'),
        displayDate: "May 1, 9:15 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted Introduction",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: introContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 2,
        dateObj: new Date('2026-04-13T14:05:00'),
        displayDate: "Apr 13, 2:05 p.m.",
        dayGroup: "Monday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Added Brainstorm tab",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 1,
        dateObj: new Date('2026-04-05T10:45:00'),
        displayDate: "Apr 5, 10:45 a.m.",
        dayGroup: "Sunday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted essay outline",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent }
        ]
    }
];

// ============================================================
// 3. LOCAL STORAGE HELPERS
// ============================================================

const STORAGE_KEY = 'docHistory';

function loadHistoryFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            parsed.forEach(v => {
                v.dateObj = new Date(v.dateObj);
            });
            return parsed;
        } catch (e) {
            console.warn('Failed to parse stored history, using default.');
        }
    }
    return null;
}

function saveHistoryToStorage(history) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('Failed to save history to localStorage');
    }
}

// Load history or use default
let documentHistory = loadHistoryFromStorage() || defaultHistory;
// Save the loaded/default history to storage so it's persisted
saveHistoryToStorage(documentHistory);

// ============================================================
// 4. HISTORY ENGINE
// ============================================================

const HistoryEngine = (() => {
    let _history = documentHistory;
    let _selectedPreviewIndex = 0;
    let _snapshotTimeout = null;
    let _nextId = _history.length > 0 ? Math.max(..._history.map(v => v.id)) + 1 : 10;

    function _getCurrentTabsState() {
        const tabs = EditorEngine.getTabs();
        return tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            content: tab.htmlContent
        }));
    }

    function _createSnapshot(description) {
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const displayHour = hours % 12 || 12;
        const displayDate = `${now.toLocaleString('en', { month: 'short' })} ${now.getDate()}, ${displayHour}:${mins} ${ampm}`;
        const dayGroup = now.toLocaleString('en', { weekday: 'long' });

        return {
            id: _nextId++,
            dateObj: now,
            displayDate: displayDate,
            dayGroup: dayGroup,
            author: "You",
            authorColor: "#4285f4",
            description: description || "Edited: Auto-saved snapshot",
            tabsState: _getCurrentTabsState()
        };
    }

    function _saveSnapshot(description) {
        const snapshot = _createSnapshot(description);
        _history.unshift(snapshot);
        if (_history.length > 50) _history.pop();
        saveHistoryToStorage(_history);   // persist
        renderHistorySidebar();
        return snapshot;
    }

    return {
        captureSnapshot(description) {
            return _saveSnapshot(description);
        },
        scheduleSnapshot(description) {
            clearTimeout(_snapshotTimeout);
            _snapshotTimeout = setTimeout(() => {
                _saveSnapshot(description || "Auto-saved");
            }, 1500);
        },
        previewSnapshot(index) {
            _selectedPreviewIndex = index;
            const version = _history[index];
            if (!version) return;
            previewVersion(version.id);
        },
        getSelectedPreviewIndex() {
            return _selectedPreviewIndex;
        },
        rollbackTo(index) {
            const version = _history[index];
            if (!version) return;
            const tabsState = version.tabsState;
            if (!tabsState || tabsState.length === 0) return;

            const liveTabs = EditorEngine.getTabs();
            liveTabs.length = 0;
            tabsState.forEach((tabState, idx) => {
                const newTab = {
                    id: tabState.id || `tab_${Date.now()}_${idx}`,
                    title: tabState.title || `Tab ${idx + 1}`,
                    htmlContent: tabState.content || '<div></div>'
                };
                liveTabs.push(newTab);
            });

            EditorEngine.renderTabsSidebar();
            EditorEngine.loadActiveTabContent();

            document.getElementById('version-history-view').hidden = true;
            _saveSnapshot(`Restored to version from ${version.displayDate}`);
        },
        getHistory() {
            return _history;
        }
    };
})();

// ============================================================
// 5. RENDER FUNCTIONS
// ============================================================

let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = 'tab1';

function renderHistorySidebar() {
    const listContainer = document.getElementById('version-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    let currentDayGroup = '';

    documentHistory.forEach((version, index) => {
        if (version.dayGroup !== currentDayGroup) {
            currentDayGroup = version.dayGroup;
            const dayHeader = document.createElement('div');
            dayHeader.className = 'vh-day-group';
            dayHeader.textContent = currentDayGroup;
            listContainer.appendChild(dayHeader);
        }

        const isCurrent = index === 0;
        const itemHtml = `
            <div class="vh-item ${isCurrent ? 'active' : ''}" data-id="${version.id}">
                <div class="vh-item-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
                <div class="vh-item-content">
                    <div class="vh-item-time">${version.displayDate}</div>
                    <div class="vh-item-subtitle" style="font-style: italic; margin-bottom: 4px;">${version.description}</div>
                    <div class="vh-item-author-row">
                        <div class="vh-author-dot" style="background-color: ${version.authorColor};"></div>
                        <span style="color: ${version.authorColor}; font-weight: 500;">${version.author}</span>
                    </div>
                </div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHtml;
        const itemEl = tempDiv.firstElementChild;
        itemEl.addEventListener('click', () => {
            document.querySelectorAll('.vh-item').forEach(i => i.classList.remove('active'));
            itemEl.classList.add('active');
            previewVersion(version.id);
        });
        listContainer.appendChild(itemEl);
    });
}

function previewVersion(versionId) {
    const version = documentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    document.getElementById('vh-top-date-title').textContent = version.displayDate;

    const tabsContainer = document.getElementById('vh-tabs-container');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    if (!version.tabsState || version.tabsState.length === 0) {
        tabsContainer.innerHTML = '<div style="padding:16px; color:#5f6368;">No tabs</div>';
        return;
    }

    const tabIds = version.tabsState.map(t => t.id);
    if (!tabIds.includes(currentlyPreviewingTabId)) {
        currentlyPreviewingTabId = version.tabsState[0].id;
    }

    version.tabsState.forEach(tab => {
        const isActive = tab.id === currentlyPreviewingTabId;
        const row = document.createElement('div');
        row.className = `tab-item-row ${isActive ? 'active' : ''}`;
        row.style.cursor = 'pointer';
        row.innerHTML = `
            <input type="text" class="tab-name-input" value="${tab.title}" readonly
                   style="background: ${isActive ? '#ffffff' : 'transparent'};
                          border-color: ${isActive ? 'var(--border-strong)' : 'transparent'};
                          font-weight: ${isActive ? '500' : 'normal'};
                          color: ${isActive ? 'var(--accent-blue)' : 'var(--text-primary)'};
                          width: 80%; outline: none; border-radius: 3px; padding: 2px 4px; font-size: inherit; font-family: inherit;">
        `;
        row.addEventListener('click', () => {
            currentlyPreviewingTabId = tab.id;
            previewVersion(versionId);
        });
        tabsContainer.appendChild(row);
    });

    const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId) || version.tabsState[0];
    const canvas = document.getElementById('vh-canvas');
    if (canvas) {
        let html = activeTab.content;
        if (version.author === 'You') {
            html = `<div class="vh-edit-you"><span class="vh-edit-label">You</span>${html}</div>`;
        }
        canvas.innerHTML = html;
    }

    const totalSpan = document.getElementById('vh-total-edits');
    if (totalSpan) totalSpan.textContent = `Total: ${documentHistory.length} edits`;
}

// Public save function (used by editor)
function saveVersionToHistory(description) {
    return HistoryEngine.captureSnapshot(description);
}

// Restore from saved tabs (used by history restore)
window.restoreFullDocumentState = function(savedTabsState) {
    const liveTabs = EditorEngine.getTabs();
    liveTabs.length = 0;
    savedTabsState.forEach((tabState, idx) => {
        const newTab = {
            id: tabState.id || `tab_${Date.now()}_${idx}`,
            title: tabState.title || `Tab ${idx + 1}`,
            htmlContent: tabState.content || '<div></div>'
        };
        liveTabs.push(newTab);
    });
    EditorEngine.renderTabsSidebar();
    EditorEngine.loadActiveTabContent();
};

// ============================================================
// 6. INITIALIZATION
// ============================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderHistorySidebar();
        if (documentHistory.length > 0) previewVersion(documentHistory[0].id);
        // Also load the latest version's tabs into the editor
        const latest = documentHistory[0];
        if (latest && latest.tabsState) {
            window.restoreFullDocumentState(latest.tabsState);
        }
    });
} else {
    renderHistorySidebar();
    if (documentHistory.length > 0) previewVersion(documentHistory[0].id);
    const latest = documentHistory[0];
    if (latest && latest.tabsState) {
        window.restoreFullDocumentState(latest.tabsState);
    }
}
