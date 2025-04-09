// ==========================================================================
// Kershaw Law Firm - Forums Management (V1.0 - H-2A/H-2B Dashboard)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // === Core Element Selectors ===
    const forumsContent = document.getElementById('forums-content');
    const forumList = document.getElementById('forum-list');
    const newThreadForm = document.getElementById('new-thread-form');

    // === Data Stores (Synced with localStorage) ===
    let cases = JSON.parse(localStorage.getItem('cases')) || [];
    let forums = JSON.parse(localStorage.getItem('forums')) || [
        { id: 'F001', caseId: 'H2A-015', title: 'H-2A Filing Questions', createdBy: 'Eleanor Vance', created: '2025-04-08', posts: [
            { id: 'P001', author: 'Eleanor Vance', content: 'Any questions about the ETA-9142A filing?', timestamp: '2025-04-08 10:00' },
            { id: 'P002', author: 'Acme Corp', content: 'Yes, what’s the deadline?', timestamp: '2025-04-08 11:00' }
        ]},
        { id: 'F002', caseId: 'H2B-001', title: 'RFE Response Discussion', createdBy: 'John Doe', created: '2025-04-07', posts: [
            { id: 'P003', author: 'John Doe', content: 'Need help with the RFE response.', timestamp: '2025-04-07 14:00' }
        ]}
    ];

    // === Render Forums ===
    function renderForums() {
        forumList.innerHTML = '';
        forums.forEach(thread => {
            const threadDiv = document.createElement('div');
            threadDiv.className = 'forum-thread';
            threadDiv.style.cssText = 'background: linear-gradient(to bottom, #1b2028, #232832); padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); transition: transform 0.3s ease;';
            threadDiv.innerHTML = `
                <h3 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 1.4rem; margin-bottom: 10px;">${thread.title} (Case: ${thread.caseId})</h3>
                <p style="color: #9aa0ae; font-style: italic;">Started by ${thread.createdBy} on ${thread.created}</p>
                <div class="thread-posts" style="margin-top: 15px;"></div>
                <form class="reply-form" style="margin-top: 15px; display: flex; gap: 10px;">
                    <input type="text" class="reply-input" placeholder="Add a reply..." style="flex-grow: 1; padding: 10px; background: #2d333f; border: 1px solid #4a5160; border-radius: 8px; color: #e2e2e2;">
                    <button type="submit" class="button primary small">Reply</button>
                </form>
            `;
            const postsDiv = threadDiv.querySelector('.thread-posts');
            thread.posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.style.cssText = 'background: #2d333f; padding: 15px; border-radius: 8px; margin-bottom: 10px;';
                postDiv.innerHTML = `
                    <p style="color: #e2e2e2;"><strong>${post.author}:</strong> ${post.content}</p>
                    <span style="color: #7a8290; font-size: 0.85rem;">${post.timestamp}</span>
                `;
                postsDiv.appendChild(postDiv);
            });
            forumList.appendChild(threadDiv);

            // Reply Form Handling
            const replyForm = threadDiv.querySelector('.reply-form');
            replyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const replyInput = replyForm.querySelector('.reply-input');
                const content = replyInput.value.trim();
                if (content) {
                    const newPost = {
                        id: `P${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
                        author: 'Eleanor Vance', // Simulated admin
                        content,
                        timestamp: new Date().toLocaleString()
                    };
                    thread.posts.push(newPost);
                    localStorage.setItem('forums', JSON.stringify(forums));
                    renderForums();
                    triggerNotification(`New reply added to "${thread.title}"`);
                    replyInput.value = '';
                }
            });
        });
    }

    // === New Thread Form Handling ===
    newThreadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const caseId = document.getElementById('thread-case-id').value;
        const title = document.getElementById('thread-title').value.trim();
        if (!caseId || !title) {
            alert('Please select a case and enter a title.');
            return;
        }
        const newThread = {
            id: `F${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
            caseId,
            title,
            createdBy: 'Eleanor Vance', // Simulated admin
            created: new Date().toISOString().split('T')[0],
            posts: []
        };
        forums.push(newThread);
        localStorage.setItem('forums', JSON.stringify(forums));
        renderForums();
        triggerNotification(`New forum thread "${title}" created`);
        newThreadForm.reset();
    });

    // === Populate Case Dropdown ===
    function populateCaseDropdown() {
        const caseSelect = document.getElementById('thread-case-id');
        caseSelect.innerHTML = '<option value="" disabled selected>Select Case...</option>';
        cases.forEach(caseData => {
            const option = document.createElement('option');
            option.value = caseData.id;
            option.textContent = `${caseData.id} - ${caseData.client}`;
            caseSelect.appendChild(option);
        });
    }

    // === Notification Trigger ===
    function triggerNotification(message) {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({ id: `N${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, message, date: new Date().toISOString(), read: false });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        updateDashboardNotifications();
    }

    // === Sync with Dashboard Notifications ===
    function updateDashboardNotifications() {
        const notificationButton = document.querySelector('.notification-button');
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = notificationButton.querySelector('.notification-badge');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // === Initial Render ===
    populateCaseDropdown();
    renderForums();

    // === CSS Injection (Temporary until added to dashboard_desktop.css) ===
    const style = document.createElement('style');
    style.textContent = `
        .forum-thread:hover { transform: scale(1.02); }
        .reply-input:focus { border-color: #d63b2c; box-shadow: 0 0 0 4px rgba(214, 59, 44, 0.25); background: #3c4352; }
    `;
    document.head.appendChild(style);
});
