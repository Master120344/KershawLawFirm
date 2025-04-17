// --- Notifications Logic (Desktop) ---

// Note: Assumes 'AppState', 'DOM', and helper functions are available globally.
// This script should be loaded after dashboard_helpers_desktop.js and client_dashboard_desktop.js

// --- Notification State (Placeholder) ---
const NotificationState = {
    isLoading: false,
    notifications: [
        // Example notifications - Replace with actual fetched data
        { id: 'n1', type: 'info', message: 'Your H-2A petition (KLR-H2A-...) was submitted to USCIS.', date: '2025-03-15', read: false, link: '#/case/details' },
        { id: 'n2', type: 'action', message: 'New document requires your signature: Fee Agreement Addendum.', date: '2025-03-18', read: false, link: '#/documents/sign/fee-addendum' },
        { id: 'n3', type: 'success', message: 'Payment of $1500.00 received successfully.', date: '2025-03-10', read: true, link: '#/billing/history' }
    ],
    panelVisible: false
};

// --- DOM Elements (Specific to Notifications) ---
// We rely on the main DOM object, but might define panel elements here if created dynamically
let notificationPanelElement = null; // Will be assigned in setup

// --- Functions ---

/**
 * Fetches notification data (Simulated).
 * In a real app, this would make an API call.
 */
async function fetchNotificationsDesktop() {
    if (NotificationState.isLoading) return; // Prevent multiple fetches
    console.log("Fetching notifications...");
    NotificationState.isLoading = true;
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    // --- SIMULATED DATA ---
    // In a real app, update NotificationState.notifications with API response
    // For demo, we'll use the initial placeholder data and maybe mark one as read
    const unreadCount = NotificationState.notifications.filter(n => !n.read).length;
    updateBadge(DOM.notificationsBadgeDesktop, unreadCount); // Update header badge
    NotificationState.isLoading = false;
    console.log("Notifications fetched (simulated). Unread:", unreadCount);

    // Re-render the panel if it's visible
    if (NotificationState.panelVisible) {
        renderNotificationsPanelDesktop();
    }
}

/**
 * Creates the HTML for a single notification item.
 * @param {object} notification - The notification object.
 * @returns {string} HTML string for the list item.
 */
function createNotificationItemHTML(notification) {
    const isUnread = !notification.read;
    const dateFormatted = formatDate(notification.date) || 'Recently'; // Use helper
    let iconClass = 'fa-info-circle'; // Default icon
    let typeClass = 'info';

    switch (notification.type) {
        case 'action': iconClass = 'fa-triangle-exclamation'; typeClass = 'action'; break;
        case 'success': iconClass = 'fa-check-circle'; typeClass = 'success'; break;
        case 'warning': iconClass = 'fa-exclamation-circle'; typeClass = 'warning'; break;
        case 'error': iconClass = 'fa-times-circle'; typeClass = 'error'; break;
        // 'info' uses default
    }

    return `
        <li class="notification-item ${isUnread ? 'unread' : ''} type-${typeClass}" data-notification-id="${notification.id}">
            <a href="${notification.link || '#'}" class="notification-link">
                <span class="notification-icon"><i class="fa-solid ${iconClass}"></i></span>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-date">${dateFormatted}</span>
                </div>
            </a>
            ${isUnread ? '<button class="mark-read-btn" title="Mark as read"><i class="fas fa-circle"></i></button>' : ''}
        </li>
    `;
}

/**
 * Renders the notifications into the panel.
 */
function renderNotificationsPanelDesktop() {
    if (!notificationPanelElement) {
        console.error("Notification panel element not found.");
        return;
    }

    const listElement = notificationPanelElement.querySelector('.notifications-list');
    if (!listElement) {
        console.error("Notification list container not found in panel.");
        return;
    }

    if (NotificationState.isLoading) {
        listElement.innerHTML = '<li class="notification-item loading"><div class="mini-loader-desktop" style="margin: 10px auto;"></div> Loading...</li>';
        return;
    }

    if (NotificationState.notifications.length === 0) {
        listElement.innerHTML = '<li class="notification-item empty">No notifications found.</li>';
        return;
    }

    listElement.innerHTML = NotificationState.notifications
        .map(createNotificationItemHTML)
        .join('');

    // Add event listeners to dynamically created elements (mark read, links)
    addNotificationItemListeners(listElement);
}

/**
 * Adds event listeners to items within the notification list.
 * @param {HTMLElement} listElement - The UL element containing notification items.
 */
function addNotificationItemListeners(listElement) {
    listElement.querySelectorAll('.notification-link').forEach(link => {
        // Prevent adding multiple listeners if re-rendered
        if (!link.hasAttribute('data-click-listener')) {
            link.addEventListener('click', handleNotificationLinkClick);
            link.setAttribute('data-click-listener', 'true');
        }
    });

    listElement.querySelectorAll('.mark-read-btn').forEach(button => {
        if (!button.hasAttribute('data-click-listener')) {
            button.addEventListener('click', handleMarkReadClick);
            button.setAttribute('data-click-listener', 'true');
        }
    });
}

/**
 * Handles clicking on a notification link.
 * @param {Event} event - The click event.
 */
function handleNotificationLinkClick(event) {
    event.preventDefault(); // Prevent default link navigation
    const listItem = event.currentTarget.closest('.notification-item');
    const notificationId = listItem?.dataset.notificationId;
    const url = event.currentTarget.href;

    console.log(`Notification link clicked: ID=${notificationId}, URL=${url}`);

    if (notificationId) {
        markNotificationAsRead(notificationId); // Mark as read on click
    }

    // Close panel and navigate (using main dashboard navigation)
    hideNotificationsPanelDesktop();
    if (url && url !== '#') {
        // Use the navigateTo function from the main dashboard script if available
        if (typeof navigateTo === 'function') {
            navigateTo(url, `Notification Item ${notificationId || ''}`);
        } else {
            alert(`Placeholder navigation to: ${url}`);
        }
    }
}

/**
 * Handles clicking the 'Mark as Read' button.
 * @param {Event} event - The click event.
 */
function handleMarkReadClick(event) {
    event.stopPropagation(); // Prevent the link click handler from firing
    const listItem = event.currentTarget.closest('.notification-item');
    const notificationId = listItem?.dataset.notificationId;

    if (notificationId) {
        console.log(`Marking notification ${notificationId} as read.`);
        markNotificationAsRead(notificationId);
    }
}


/**
 * Marks a specific notification as read in the state and updates the UI.
 * @param {string} notificationId - The ID of the notification to mark read.
 */
function markNotificationAsRead(notificationId) {
    const notification = NotificationState.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;

        // --- SIMULATION: In real app, send API request to mark as read ---
        console.log(`API call simulation: Mark notification ${notificationId} as read.`);

        // Update UI immediately for responsiveness
        const listItem = notificationPanelElement?.querySelector(`.notification-item[data-notification-id="${notificationId}"]`);
        if (listItem) {
            listItem.classList.remove('unread');
            const markReadButton = listItem.querySelector('.mark-read-btn');
            if (markReadButton) {
                markReadButton.remove(); // Remove the button
            }
        }

        // Update badge count
        const unreadCount = NotificationState.notifications.filter(n => !n.read).length;
        updateBadge(DOM.notificationsBadgeDesktop, unreadCount);
    }
}

/**
 * Toggles the visibility of the notifications panel.
 */
function toggleNotificationsPanelDesktop() {
    if (!notificationPanelElement) {
         console.error("Cannot toggle: Notification panel element not found.");
         createNotificationsPanelStructure(); // Attempt to create it if missing
         if(!notificationPanelElement) return; // Exit if creation failed
    }

    NotificationState.panelVisible = !NotificationState.panelVisible;
    if (NotificationState.panelVisible) {
        // Fetch data when opening if needed (or if data is stale)
        // For now, just fetch every time it opens if empty, otherwise render
        if (NotificationState.notifications.length === 0 || !NotificationState.isLoading) { // Avoid fetch if already loading
             fetchNotificationsDesktop().then(renderNotificationsPanelDesktop);
        } else {
             renderNotificationsPanelDesktop(); // Render existing data
        }
        notificationPanelElement.classList.add('visible');
        // Add class to body to detect click outside
        document.body.classList.add('notifications-panel-open');
    } else {
        notificationPanelElement.classList.remove('visible');
        document.body.classList.remove('notifications-panel-open');
    }
}

/**
 * Hides the notifications panel.
 */
function hideNotificationsPanelDesktop() {
     if (NotificationState.panelVisible && notificationPanelElement) {
         notificationPanelElement.classList.remove('visible');
         document.body.classList.remove('notifications-panel-open');
         NotificationState.panelVisible = false;
     }
}

/**
 * Creates the basic HTML structure for the notifications panel if it doesn't exist.
 * Appends it near the header actions.
 */
function createNotificationsPanelStructure() {
    if (document.getElementById('notifications-panel-desktop')) {
        notificationPanelElement = document.getElementById('notifications-panel-desktop');
        return; // Already exists
    }

    const panelHTML = `
        <div id="notifications-panel-desktop" class="notifications-panel card-style-desktop">
            <div class="notifications-header">
                <h4 class="panel-title">Notifications</h4>
                <button id="mark-all-read-btn" class="link-button" title="Mark all as read">Mark All Read</button>
            </div>
            <ul class="notifications-list">
                <!-- Notifications will be loaded here by JS -->
                <li class="notification-item empty">Loading...</li>
            </ul>
            <div class="notifications-footer">
                <a href="#/notifications" id="view-all-notifications-link" class="link-button">View All Notifications</a>
            </div>
        </div>
    `;

    // Insert the panel into the DOM, ideally near the header or button container
    const headerActions = DOM.headerActionsDesktop; // Use DOM reference from main script
    if (headerActions) {
         headerActions.insertAdjacentHTML('beforeend', panelHTML);
         notificationPanelElement = document.getElementById('notifications-panel-desktop');
         console.log("Notifications panel structure created.");

         // Add listeners for newly created panel elements
         const markAllReadBtn = notificationPanelElement.querySelector('#mark-all-read-btn');
         if(markAllReadBtn) {
             markAllReadBtn.addEventListener('click', () => {
                 console.log("Marking all as read...");
                 NotificationState.notifications.forEach(n => { if (!n.read) markNotificationAsRead(n.id); });
             });
         }
         const viewAllLink = notificationPanelElement.querySelector('#view-all-notifications-link');
         if(viewAllLink) {
            viewAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                hideNotificationsPanelDesktop();
                if(typeof navigateTo === 'function') navigateTo('#/notifications', 'All Notifications');
                else alert("Placeholder: Navigate to All Notifications page");
            });
         }

    } else {
        console.error("Could not find '.header-actions-desktop' to append notification panel.");
    }
}

/**
 * Sets up the initial event listeners for the notification bell icon.
 */
function setupNotificationLogicDesktop() {
    // Ensure DOM object and button exist
    if (typeof DOM === 'undefined' || !DOM.notificationsButtonDesktop) {
        console.error("DOM or notification button not available for setup.");
        return;
    }

    // Create the panel structure first (it will check if it exists)
    createNotificationsPanelStructure();

    // Click listener for the bell icon
    if (!DOM.notificationsButtonDesktop.hasAttribute('data-notif-listener')) {
        DOM.notificationsButtonDesktop.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent potential body click handler from closing immediately
            toggleNotificationsPanelDesktop();
        });
        DOM.notificationsButtonDesktop.setAttribute('data-notif-listener', 'true');
    }

    // Optional: Add hover effect logic if CSS isn't sufficient
    // Example: Add a class on hover
    /*
    if (!DOM.notificationsButtonDesktop.hasAttribute('data-hover-listener')) {
        DOM.notificationsButtonDesktop.addEventListener('mouseenter', () => {
            DOM.notificationsButtonDesktop.classList.add('hover-effect'); // Add class for CSS animation
        });
        DOM.notificationsButtonDesktop.addEventListener('mouseleave', () => {
             DOM.notificationsButtonDesktop.classList.remove('hover-effect');
        });
        DOM.notificationsButtonDesktop.setAttribute('data-hover-listener', 'true');
    }
    */

    // Listener to close panel when clicking outside
    if (!document.body.hasAttribute('data-body-notif-listener')) {
        document.addEventListener('click', (event) => {
            if (!notificationPanelElement || !NotificationState.panelVisible) {
                return; // Panel doesn't exist or isn't visible
            }
            // Check if the click was outside the panel AND outside the bell button
            const isClickInsidePanel = notificationPanelElement.contains(event.target);
            const isClickOnButton = DOM.notificationsButtonDesktop.contains(event.target);

            if (!isClickInsidePanel && !isClickOnButton) {
                hideNotificationsPanelDesktop();
            }
        });
        document.body.setAttribute('data-body-notif-listener', 'true');
    }

    // Initial fetch or badge update
    const initialUnread = NotificationState.notifications.filter(n => !n.read).length;
    updateBadge(DOM.notificationsBadgeDesktop, initialUnread);
    // Optionally fetch fresh data on load:
    // fetchNotificationsDesktop();
}

// --- End Notifications Logic ---
