document.addEventListener('DOMContentLoaded', () => {
    const notificationButton = document.querySelector('.notification-button');
    const notificationCount = document.getElementById('notification-count');
    const mainContentArea = document.getElementById('main-content-area');
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

    const notificationPanelHTML = `
        <div class="notification-panel" id="notification-panel" style="display: none;">
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="icon-button subtle" id="close-notification-btn">✕</button>
            </div>
            <div class="notification-list" id="notification-list"></div>
            <div class="notification-actions">
                <button class="button secondary small" id="clear-notifications-btn">Clear All</button>
            </div>
        </div>
    `;

    function updateNotificationCount() {
        notificationCount.textContent = notifications.filter(n => !n.read).length;
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    function updateNotificationList() {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;
        notificationList.innerHTML = '';
        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        notifications.forEach((notif, index) => {
            const notifItem = document.createElement('div');
            notifItem.classList.add('notification-item');
            if (!notif.read) notifItem.classList.add('unread');
            notifItem.innerHTML = `
                <span class="notif-text">${notif.message}</span>
                <span class="notif-time">${new Date(notif.timestamp).toLocaleTimeString()}</span>
            `;
            notifItem.addEventListener('click', () => markAsRead(index));
            notificationList.appendChild(notifItem);
        });
    }

    function showClippy(message) {
        const clippyMessage = document.getElementById('clippy-message');
        if (clippyMessage) clippyMessage.textContent = message;
        const clippy = document.getElementById('clippy-lawyer');
        if (clippy) {
            clippy.style.display = 'block';
            clippy.style.opacity = '1';
            clippy.classList.add('bounce');
            setTimeout(() => clippy.classList.remove('bounce'), 1500);
        }
    }

    function addNotification(message) {
        const newNotif = {
            id: Date.now(),
            message,
            timestamp: new Date().toISOString(),
            read: false
        };
        notifications.unshift(newNotif);
        updateNotificationCount();
        updateNotificationList();
        showClippy(`New alert: ${message}`);
    }

    function markAsRead(index) {
        notifications[index].read = true;
        updateNotificationCount();
        updateNotificationList();
    }

    function clearNotifications() {
        notifications = [];
        updateNotificationCount();
        updateNotificationList();
        showClippy('Notifications cleared!');
    }

    function showNotificationPanel() {
        if (!document.getElementById('notification-panel')) {
            mainContentArea.insertAdjacentHTML('beforeend', notificationPanelHTML);
            const panel = document.getElementById('notification-panel');
            const closeBtn = document.getElementById('close-notification-btn');
            const clearBtn = document.getElementById('clear-notifications-btn');

            panel.style.display = 'block';
            panel.style.opacity = '0';
            setTimeout(() => {
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            }, 50);

            closeBtn.addEventListener('click', () => {
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(20px)';
                setTimeout(() => panel.remove(), 300);
            });

            clearBtn.addEventListener('click', clearNotifications);

            updateNotificationList();
        }
    }

    notificationButton.addEventListener('click', showNotificationPanel);

    // Sync with other dashboard components
    window.addEventListener('aiCommandProcessed', (e) => {
        const command = e.detail.command.toLowerCase();
        if (command.includes('notification')) {
            addNotification('AI Assistant processed your request.');
        }
    });

    window.addEventListener('clientTaskAdded', (e) => {
        const { taskTitle, clientId } = e.detail;
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const client = clients.find(c => c.id === clientId);
        addNotification(`New task "${taskTitle}" added for ${client ? client.name : 'a client'}.`);
    });

    window.addEventListener('documentSent', (e) => {
        const { type, clientName } = e.detail;
        addNotification(`DocuSign "${type}" sent to ${clientName}.`);
    });

    window.addEventListener('taskCompleted', (e) => {
        const { title } = e.detail;
        addNotification(`Task "${title}" marked as completed.`);
    });

    window.addEventListener('deadlineAdded', (e) => {
        const { description, date } = e.detail;
        addNotification(`New deadline "${description}" set for ${date}.`);
    });

    // Custom event dispatcher for other scripts
    function dispatchNotificationEvent(message) {
        const event = new CustomEvent('notificationAdded', { detail: { message } });
        window.dispatchEvent(event);
    }

    // Initial load
    updateNotificationCount();

    // Example usage from other scripts
    window.addEventListener('notificationAdded', (e) => {
        addNotification(e.detail.message);
    });
});