// ==========================================================================
// Kershaw Law Firm - Notifications Management (V1.0 - H-2A/H-2B Dashboard)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // === Core Element Selectors ===
    const notificationButton = document.querySelector('.notification-button');
    const notificationDropdown = createNotificationDropdown();

    // === Data Store (Synced with localStorage via API simulation) ===
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [
        { id: 'N001', message: 'New client "Acme Corp" added', date: '2025-04-08 10:00', read: false },
        { id: 'N002', message: 'Document uploaded for H2B-001', date: '2025-04-08 12:30', read: false },
        { id: 'N003', message: 'Task T001 overdue', date: '2025-04-09 09:00', read: false }
    ];

    // === Notification Dropdown ===
    function createNotificationDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'notification-dropdown';
        dropdown.style.cssText = 'position: absolute; top: calc(100% + 15px); right: 0; background: linear-gradient(to bottom, #1b2028, #232832); border: 1px solid #252a33; border-radius: 12px; box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5); width: 350px; max-height: 400px; overflow-y: auto; z-index: 300; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s ease; backdrop-filter: blur(5px);';
        dropdown.innerHTML = `
            <div class="notification-header" style="padding: 15px; border-bottom: 1px solid #252a33;">
                <h3 style="font-family: 'Cinzel', serif; color: #ffffff; font-size: 1.2rem; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);">Notifications</h3>
                <button id="mark-all-read" class="button secondary tiny" style="margin-left: auto; display: block;">Mark All Read</button>
            </div>
            <div id="notification-list" style="padding: 10px;"></div>
            <div class="notification-footer" style="padding: 10px; border-top: 1px solid #252a33; text-align: center;">
                <button id="clear-notifications" class="button secondary small">Clear All</button>
            </div>
        `;
        notificationButton.parentElement.appendChild(dropdown);
        return dropdown;
    }

    // === Render Notifications ===
    function renderNotifications() {
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = '';
        const unreadCount = notifications.filter(n => !n.read).length;
        const badge = notificationButton.querySelector('.notification-badge');
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';

        if (notifications.length === 0) {
            notificationList.innerHTML = '<p style="color: #9aa0ae; text-align: center; padding: 20px;">No notifications yet.</p>';
            return;
        }

        notifications.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
        notifications.forEach(notification => {
            const notifDiv = document.createElement('div');
            notifDiv.className = 'notification-item';
            notifDiv.style.cssText = `padding: 15px; border-bottom: 1px solid #252a33; background: ${notification.read ? 'transparent' : 'rgba(214, 59, 44, 0.1)'}; transition: background 0.3s ease; cursor: pointer;`;
            notifDiv.innerHTML = `
                <p style="color: ${notification.read ? '#9aa0ae' : '#e2e2e2'}; margin: 0; font-size: 0.95rem;">${notification.message}</p>
                <span style="color: #7a8290; font-size: 0.85rem;">${new Date(notification.date).toLocaleString()}</span>
                <button class="mark-read" data-id="${notification.id}" style="display: ${notification.read ? 'none' : 'inline-block'}; background: none; border: none; color: #d63b2c; font-size: 0.9rem; cursor: pointer; margin-left: 10px;">Mark Read</button>
            `;
            notificationList.appendChild(notifDiv);

            notifDiv.addEventListener('click', () => toggleReadStatus(notification.id));
            notifDiv.querySelector('.mark-read')?.addEventListener('click', (e) => {
                e.stopPropagation();
                markNotificationRead(notification.id);
            });
        });
    }

    // === Notification Controls ===
    notificationButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.getElementById('mark-all-read').addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        renderNotifications();
        triggerNotification('All notifications marked as read');
    });

    document.getElementById('clear-notifications').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all notifications?')) {
            notifications = [];
            localStorage.setItem('notifications', JSON.stringify(notifications));
            renderNotifications();
            triggerNotification('All notifications cleared');
        }
    });

    document.addEventListener('click', (e) => {
        if (!notificationDropdown.contains(e.target) && e.target !== notificationButton) {
            hideDropdown();
        }
    });

    function toggleDropdown() {
        if (notificationDropdown.style.visibility === 'visible') {
            hideDropdown();
        } else {
            showDropdown();
        }
    }

    function showDropdown() {
        notificationDropdown.style.opacity = '1';
        notificationDropdown.style.visibility = 'visible';
        notificationDropdown.style.transform = 'translateY(0)';
    }

    function hideDropdown() {
        notificationDropdown.style.opacity = '0';
        notificationDropdown.style.visibility = 'hidden';
        notificationDropdown.style.transform = 'translateY(20px)';
    }

    function toggleReadStatus(id) {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = !notification.read;
            localStorage.setItem('notifications', JSON.stringify(notifications));
            renderNotifications();
            triggerNotification(`Notification "${notification.message}" marked as ${notification.read ? 'read' : 'unread'}`);
        }
    }

    function markNotificationRead(id) {
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
            renderNotifications();
            triggerNotification(`Notification "${notification.message}" marked as read`);
        }
    }

    // === Notification Trigger (Global Access) ===
    window.triggerNotification = function(message) {
        const newNotification = {
            id: `N${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            message,
            date: new Date().toISOString(),
            read: false
        };
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        renderNotifications();
        if (typeof window.api !== 'undefined') {
            window.api.addNotification(newNotification); // Sync with API if available
        }
    };

    // === Initial Render ===
    renderNotifications();

    // === CSS Injection (Temporary until added to dashboard_desktop.css) ===
    const style = document.createElement('style');
    style.textContent = `
        .notification-item:hover { background: rgba(255, 255, 255, 0.05); }
        #notification-list::-webkit-scrollbar { width: 8px; }
        #notification-list::-webkit-scrollbar-track { background: transparent; }
        #notification-list::-webkit-scrollbar-thumb { background: #4a5160; border-radius: 4px; }
        #notification-list::-webkit-scrollbar-thumb:hover { background: #d63b2c; }
    `;
    document.head.appendChild(style);
});
