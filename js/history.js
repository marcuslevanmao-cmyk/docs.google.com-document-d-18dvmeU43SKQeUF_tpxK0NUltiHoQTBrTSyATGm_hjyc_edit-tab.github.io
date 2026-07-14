// history.js

// The content builds up chronologically
const outlineContent = `<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>`;
const introContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature.</p>`;
const bodyContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p><p>Religion has long served as one of humanity's most influential systems for moral education.</p>`;
const finalContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><br><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables...</p>`;

const brainstormContent = `<h2>Brainstorming Notes</h2><ul><li><b>Theme:</b> Utility vs Truth</li><li><b>Key thinkers:</b> Durkheim, Haidt</li></ul>`;

let documentHistory = [
    {
        id: 9, // CURRENT
        dateObj: new Date(),
        displayDate: "July 14, 3:00 p.m.",
        dayGroup: "Tuesday",
        author: "You",
        authorColor: "#4285f4", // Blue for "You"
        description: "Edited: Final review and minor polishes",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 8,
        dateObj: new Date('2026-05-15T16:00:00'),
        displayDate: "May 15, 4:00 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58", // Green for Marcus
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
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Grammar and spelling fixes",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent.replace("civilizations", "civilisations") },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 5,
        dateObj: new Date('2026-05-01T11:45:00'),
        displayDate: "May 1, 11:45 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Drafted essay outline",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent }
        ]
    }
];

// ... (Rest of the functions: saveVersionToHistory, renderHistorySidebar remain similar)

// UPDATED: renderHistorySidebar now handles dynamic coloring
function renderHistorySidebar() {
    const listContainer = document.getElementById('version-list');
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

// UPDATED: previewVersion now removes tab-icon span and uses dynamic author colors
function previewVersion(versionId) {
    const version = documentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    document.getElementById('vh-top-date-title').textContent = version.displayDate;

    const tabsContainer = document.getElementById('vh-tabs-container');
    tabsContainer.innerHTML = '';
    
    if (version.tabsState && version.tabsState.length > 0) {
        version.tabsState.forEach(tab => {
            const tabEl = document.createElement('div');
            // IMMERSION CHANGE: Removed the icon span
            tabEl.className = `tab-item ${tab.id === currentlyPreviewingTabId ? 'active' : ''}`;
            tabEl.style.padding = '8px 16px';
            tabEl.style.cursor = 'pointer';
            tabEl.style.borderBottom = tab.id === currentlyPreviewingTabId ? '2px solid #1a73e8' : 'none';
            tabEl.innerHTML = `<span class="tab-title">${tab.title}</span>`; 
            
            tabEl.addEventListener('click', () => {
                currentlyPreviewingTabId = tab.id;
                previewVersion(versionId); 
            });
            tabsContainer.appendChild(tabEl);
        });

        const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId) || version.tabsState[0];
        const canvas = document.getElementById('vh-canvas');
        
        // UPDATED: Dynamic background/text based on author color
        canvas.innerHTML = `
            <div class="vh-edit-block" style="background-color: ${version.authorColor}15; color: ${version.authorColor};">
                <span class="vh-edit-author" style="color: ${version.authorColor};">${version.author}</span>
                <div style="color: black;">${activeTab.content}</div>
            </div>
        `;
    }
}
