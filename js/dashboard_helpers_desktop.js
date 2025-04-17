// --- Dashboard Helper Functions (Desktop) ---

/**
 * Formats a number as US currency.
 * @param {number|string|null|undefined} amount - The amount to format.
 * @returns {string} Formatted currency string (e.g., "$1,500.00").
 */
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(parseFloat(amount))) {
        return '$0.00';
    }
    return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a date string into a more readable format (e.g., "Feb 10, 2025").
 * Handles timezone offset correctly.
 * @param {string|null|undefined} dateString - The date string to format (YYYY-MM-DD or other parsable format).
 * @returns {string} Formatted date string or '--/--/----' if invalid.
 */
function formatDate(dateString) {
    if (!dateString) return '--/--/----';
    try {
        // Parse the date as UTC to avoid local timezone shifts during parsing
        const date = new Date(dateString + 'T00:00:00Z');
        // Check if the date is valid after parsing
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        // Format using locale 'en-US' which generally expects local time,
        // Since we parsed as UTC, toLocaleDateString will apply the necessary offset
        // based on the user's browser settings, showing the intended date.
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Return original string if formatting fails
    }
}


/**
 * Updates the text content and visibility of a notification badge.
 * Caps the displayed count at 9+.
 * @param {HTMLElement|null} badgeElement - The badge element to update.
 * @param {number|string|null|undefined} count - The notification count.
 */
function updateBadge(badgeElement, count) {
    if (!badgeElement) return;
    const numCount = parseInt(count, 10) || 0;
    badgeElement.textContent = numCount > 9 ? '9+' : numCount.toString();
    badgeElement.style.display = numCount > 0 ? 'inline-flex' : 'none'; // Use inline-flex if badge uses flex properties
}

/**
 * Maps a case status key to human-readable text and a CSS class identifier.
 * @param {string} statusKey - The internal status key (e.g., 'initial_review').
 * @returns {{text: string, class: string}} Object with text and class.
 */
function getStatusTextAndClass(statusKey) {
    const statuses = {
        'initial_review': { text: 'Initial Document Review', class: 'info' },
        'submitted_lca': { text: 'LCA Submitted to DOL', class: 'pending' },
        'pending_dol': { text: 'Pending DOL Certification', class: 'pending' },
        'dol_certified': { text: 'DOL Certified / Awaiting Filing', class: 'good' },
        'submitted_uscis': { text: 'Petition Submitted to USCIS', class: 'pending' },
        'rfe_issued': { text: 'Request for Evidence (RFE)', class: 'action' },
        'pending_uscis_review': { text: 'Pending USCIS Decision', class: 'pending' },
        'approved': { text: 'Case Approved', class: 'good' },
        'denied': { text: 'Case Denied', class: 'action' },
        'consular_processing': { text: 'Consular Processing', class: 'info' },
        'action_required': { text: 'Action Required', class: 'action' }, // Generic action status
        'complete': { text: 'Process Complete', class: 'good' },
        'signing_required': { text: 'Fee Agreement Pending', class: 'action' } // Added status for payment card context
        // Add other specific statuses as needed
    };
    return statuses[statusKey] || { text: 'Status Unavailable', class: 'default' };
}

/**
 * Updates the large status icon in the case status card based on the status class.
 * @param {HTMLElement|null} iconElement - The icon container element.
 * @param {string} statusClass - The status class ('info', 'pending', 'good', 'action', 'default').
 */
function updateStatusIcon(iconElement, statusClass) {
    if (!iconElement) return;
    // Reset classes first, then add the specific status class and FA icon
    iconElement.className = 'status-icon-large-desktop'; // Base class
    let iconClassFA = 'fa-question-circle'; // Default icon
    switch (statusClass) {
        case 'info': iconClassFA = 'fa-info-circle'; break;
        case 'pending': iconClassFA = 'fa-hourglass-half'; break;
        case 'good': iconClassFA = 'fa-check-circle'; break;
        case 'action': iconClassFA = 'fa-triangle-exclamation'; break;
        // 'default' uses fa-question-circle
    }
    iconElement.classList.add(`status-${statusClass}`); // Add specific background/color class
    iconElement.innerHTML = `<i class="fa-solid ${iconClassFA}"></i>`; // Set the Font Awesome icon
}

/**
 * Gets the display title for an action item type.
 * @param {string} type - The action type key (e.g., 'signature').
 * @returns {string} Human-readable title.
 */
 function getActionTitle(type) {
    switch (type) {
        case 'signature': return 'Signature Needed';
        case 'payment': return 'Payment Due';
        case 'information': return 'Information Required';
        case 'upload': return 'Document Upload Needed';
        default: return 'Action Needed';
    }
}

/**
 * Gets the text for the action button based on the action type.
 * @param {string} type - The action type key.
 * @returns {string} Button text.
 */
 function getActionButtonText(type) {
    switch (type) {
        case 'signature': return 'Review & Sign';
        case 'payment': return 'Make Payment';
        case 'information': return 'Provide Info';
        case 'upload': return 'Upload Now'; // Changed for clarity
        default: return 'View Details';
    }
}

// --- End Helper Functions ---
