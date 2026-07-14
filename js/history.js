// history.js

// Store the full document history (array of states)
let documentHistory = [];
let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = null;

// Helper: Format date to match "July 10, 4:01 p.m."
function formatHistoryDate(date) {
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    let time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    time = time.replace(' AM', ' a.m.').replace(' PM', ' p.m.');
    return `${month} ${day}, ${time}`;
}

// Helper: Get weekday for grouping
function getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * CALL THIS FUNCTION WHENEVER THE DOCUMENT SAVES.
 * Pass in your full array of tabs from app.js
 * Example: saveVersionToHistory(myTabsArray);
 */
function saveVersionToHistory(currentTabsState) {
    const now = new Date();
    
    const newVersion = {
        id: Date.now(),
        dateObj: now,
        displayDate: formatHistoryDate(now),
        dayGroup: getDayName(now),
        author: "Marcus Le Van Mao élève", // Placeholder author requested
        authorColor: "#0f9d58", // Google Docs green
        // Deep copy the full state so we don't accidentally mutate history
        tabsState: JSON.parse(JSON.stringify(currentTabsState)) 
    };

    documentHistory.unshift(newVersion);
    renderHistorySidebar();
}

// Render the right sidebar list
function renderHistorySidebar() {
    const listContainer = document.getElementById('version-list');
    listContainer.innerHTML = '';

    let currentDayGroup = '';

    documentHistory.forEach((version, index) => {
        // Group by day header (e.g., "Friday")
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
                <div class="vh-item-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
                <div class="vh-item-content">
                    <div class="vh-item-time">${version.displayDate}</div>
                    ${isCurrent ? `<div class="vh-item-subtitle">Current version</div>` : ''}
                    <div class="vh-item-author-row">
                        <div class="vh-author-dot" style="background-color: ${version.authorColor};"></div>
                        <span>${version.author}</span>
                    </div>
                </div>
                <div class="vh-item-menu">⋮</div>
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

// Preview a version in the center canvas
function previewVersion(versionId) {
    const version = documentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    document.getElementById('vh-top-date-title').textContent = version.displayDate;

    // Render left sidebar tabs for THIS version
    const tabsContainer = document.getElementById('vh-tabs-container');
    tabsContainer.innerHTML = '';
    
    if (version.tabsState && version.tabsState.length > 0) {
        // Default to previewing the first tab in that version, or keep current selection if valid
        if (!currentlyPreviewingTabId || !version.tabsState.find(t => t.id === currentlyPreviewingTabId)) {
            currentlyPreviewingTabId = version.tabsState[0].id;
        }

        version.tabsState.forEach(tab => {
            const tabEl = document.createElement('div');
            tabEl.className = `tab-item ${tab.id === currentlyPreviewingTabId ? 'active' : ''}`;
            tabEl.innerHTML = `<span class="tab-icon">📄</span> <span class="tab-title">${tab.title}</span>`;
            
            tabEl.addEventListener('click', () => {
                currentlyPreviewingTabId = tab.id;
                previewVersion(versionId); // re-render canvas for clicked tab
            });
            tabsContainer.appendChild(tabEl);
        });

        // Render Canvas Content with GREEN HIGHLIGHTS
        const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId);
        const canvas = document.getElementById('vh-canvas');
        
        // Wrap the content in the green edit block with the author label above it
        canvas.innerHTML = `
            <div class="vh-edit-block">
                <span class="vh-edit-author">${version.author}</span>
                ${activeTab.content}
            </div>
        `;
    }
}

// Open/Close triggers
document.getElementById('history-btn').addEventListener('click', () => {
    document.getElementById('version-history-view').hidden = false;
    // Assuming your app.js has a global variable like `appTabs` holding the document data
    // If you haven't saved an initial state yet, do it here as a fallback
    if (documentHistory.length === 0 && typeof appTabs !== 'undefined') {
        saveVersionToHistory(appTabs); 
    }
    if (documentHistory.length > 0) {
        previewVersion(documentHistory[0].id);
    }
});

document.getElementById('vh-back-btn').addEventListener('click', () => {
    document.getElementById('version-history-view').hidden = true;
});

// Full Document Restore Button Trigger
document.getElementById('vh-restore-trigger-btn').addEventListener('click', () => {
    const versionToRestore = documentHistory.find(v => v.id === currentlyPreviewingVersionId);
    if (versionToRestore) {
        // Call a function in app.js that forcefully overwrites the LIVE tabs 
        // with the FULL array from versionToRestore.tabsState
        if (typeof window.restoreFullDocumentState === 'function') {
            window.restoreFullDocumentState(versionToRestore.tabsState);
            document.getElementById('version-history-view').hidden = true;
        } else {
            console.error("Please define window.restoreFullDocumentState(stateArray) in app.js");
        }
    }
});
