document.addEventListener('DOMContentLoaded', () => {
    console.log('Client Dashboard Mobile JS Initialized (View Mode - V2).');

    // --- Essential DOM Element References ---
    const clientNameHeader = document.getElementById('client-name-header');

    // Header buttons/badges
    const inboxButton = document.getElementById('inbox-button');
    const notificationsButton = document.getElementById('notifications-button');
    const logoutButton = document.getElementById('logout-button');
    const inboxBadge = document.getElementById('inbox-badge');
    const notificationsBadge = document.getElementById('notifications-badge');

    // Overview Card Elements
    const caseStatusIcon = document.getElementById('case-status-icon');
    const caseStatusTextDetailed = document.getElementById('case-status-text-detailed');
    const progressBarInner = document.getElementById('progress-bar-inner');
    const estimatedCompletionSpan = document.getElementById('estimated-completion');

    // Action Required Section
    const actionRequiredSection = document.getElementById('action-required-section');
    const actionItemsList = document.getElementById('action-items-list');

    // Payment Section Elements
    const paymentSummary = document.getElementById('payment-summary');
    const paymentLoadingDiv = document.getElementById('payment-content-loading');
    const paymentPaidDiv = document.getElementById('payment-content-paid');
    const paymentDueDiv = document.getElementById('payment-content-due');
    const paymentErrorDiv = document.getElementById('payment-content-error');
    const lastPaymentDateSpan = document.getElementById('last-payment-date');
    const lastPaymentAmountSpan = document.getElementById('last-payment-amount');
    const nextPaymentAmountSpan = document.getElementById('next-payment-amount');
    const paymentDueDateSpan = document.getElementById('payment-due-date');
    const makePaymentButtonMain = document.getElementById('make-payment-button-main');
    const viewReceiptsLink = document.getElementById('view-receipts-link');
    const retryPaymentLoadButton = document.getElementById('retry-payment-load'); // Added retry button

    // Quick Links
    const documentsLink = document.getElementById('documents-link');
    const messagesLink = document.getElementById('messages-link');
    const videosLink = document.getElementById('videos-link');
    const profileLink = document.getElementById('profile-link');
    const messagesQuickBadge = document.getElementById('messages-quick-badge');


    // --- MOCK DATA (Used directly for viewing) ---
    const mockData = {
        clientName: "Apex Industries",
        caseStatus: "pending_dol", // 'submitted', 'pending_dol', 'pending_uscis', 'approved', 'action_required'
        caseProgressPercent: 30, // Percentage for progress bar
        estimatedCompletion: "Q1 2024",
        paymentStatus: "paid", // 'paid', 'due', 'overdue', 'error'
        lastPayment: { date: "2023-10-20", amount: "2500.00" },
        nextPayment: { amount: "1000.00", dueDate: "2023-12-01" },
        receiptHistoryUrl: "#receipts",
        unreadMessages: 3,
        unreadNotifications: 1,
        actionsRequired: [ // Array of actions
            { type: 'signature', description: 'Review and sign the updated I-129 Supplement.', docId: 'i129-update' },
            // { type: 'payment', description: 'Final processing fee payment due.', invoiceId: 'inv789' },
            { type: 'information', description: 'Please upload proof of recruitment efforts.', uploadId: 'recruitment-proof' }
        ],
        // ... add URLs for documents, videos, profile links if needed
    };
    // --- End Mock Data ---

    // --- Populate Dashboard ---
    function populateDashboard(data) {
        if (!data) { console.error("Mock data missing!"); return; }
        console.log("Populating V2 dashboard with MOCK data:", data);

        // Header
        if (clientNameHeader) clientNameHeader.textContent = data.clientName || 'Valued Client';
        updateBadge(inboxBadge, data.unreadMessages);
        updateBadge(notificationsBadge, data.unreadNotifications); // Assuming separate notification count
        updateBadge(messagesQuickBadge, data.unreadMessages); // Update quick link badge too

        // Overview / Status
        if (caseStatusTextDetailed) caseStatusTextDetailed.textContent = getStatusText(data.caseStatus);
        if (caseStatusIcon) updateStatusIcon(caseStatusIcon, data.caseStatus);
        if (progressBarInner) progressBarInner.style.width = `${data.caseProgressPercent || 0}%`;
        if (estimatedCompletionSpan) estimatedCompletionSpan.textContent = data.estimatedCompletion || 'TBD';

        // Action Required Section
        populateActionItems(data.actionsRequired || []);

        // Payment Section
        updatePaymentSection(data);

        // Setup Action Listeners (Placeholders)
        setupActionListeners(data);
    }

    // --- Helper Functions ---
    function getStatusText(statusKey) {
        const statuses = {
            'submitted': 'Application Submitted',
            'pending_dol': 'Pending DOL Review',
            'pending_uscis': 'Pending USCIS Review',
            'approved': 'Case Approved',
            'action_required': 'Action Required',
            'complete': 'Process Complete'
        };
        return statuses[statusKey] || 'Status Unavailable';
    }

    function updateStatusIcon(iconElement, statusKey) {
        iconElement.className = 'status-icon-large'; // Reset classes
        let iconClass = 'fa-info-circle'; // Default
        switch (statusKey) {
            case 'submitted': iconClass = 'fa-paper-plane'; iconElement.classList.add('status-info'); break;
            case 'pending_dol':
            case 'pending_uscis': iconClass = 'fa-hourglass-half'; iconElement.classList.add('status-pending'); break;
            case 'approved': iconClass = 'fa-check-circle'; iconElement.classList.add('status-good'); break;
            case 'action_required': iconClass = 'fa-exclamation-triangle'; iconElement.classList.add('status-action'); break;
             case 'complete': iconClass = 'fa-flag-checkered'; iconElement.classList.add('status-good'); break;
            default: iconElement.classList.add('status-info');
        }
        iconElement.innerHTML = `<i class="fa-solid ${iconClass}"></i>`; // Set Font Awesome icon
    }

    function updateBadge(badgeElement, count) {
        if (badgeElement) {
            const numCount = parseInt(count, 10) || 0;
            if (numCount > 0) {
                badgeElement.textContent = numCount > 9 ? '9+' : numCount; // Cap at 9+
                badgeElement.style.display = 'flex';
            } else {
                badgeElement.style.display = 'none';
            }
        }
    }

    function populateActionItems(actions) {
        if (!actionItemsList || !actionRequiredSection) return;

        actionItemsList.innerHTML = ''; // Clear previous items

        if (actions && actions.length > 0) {
            actions.forEach(action => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'action-item';

                const descP = document.createElement('p');
                descP.innerHTML = `<strong>${getActi</strong>onTitle(action.type)}:</strong> ${action.description || 'Details unavailable.'}`;
                itemDiv.appendChild(descP);

                const actionButton = document.createElement('button');
                actionButton.className = 'cta-button small-cta';
                actionButton.textContent = getActionButtonText(action.type);
                actionButton.dataset.action = action.type; // Store action type
                if (action.docId) actionButton.dataset.docId = action.docId;
                if (action.invoiceId) actionButton.dataset.invoiceId = action.invoiceId;
                 if (action.uploadId) actionButton.dataset.uploadId = action.uploadId;
                // Add event listener specific to this button (can be done in setupActionListeners)
                itemDiv.appendChild(actionButton);

                actionItemsList.appendChild(itemDiv);
            });
            actionRequiredSection.style.display = 'block'; // Show the section
        } else {
            actionRequiredSection.style.display = 'none'; // Hide if no actions
        }
    }

     function getActionTitle(type) {
        switch (type) {
            case 'signature': return 'Signature Needed';
            case 'payment': return 'Payment Due';
            case 'information': return 'Information Required';
            default: return 'Action Needed';
        }
    }
     function getActionButtonText(type) {
        switch (type) {
            case 'signature': return 'Review & Sign';
            case 'payment': return 'Make Payment';
            case 'information': return 'Upload/Provide Info';
            default: return 'View Details';
        }
    }


    // --- Update Payment Section ---
    function updatePaymentSection(data) {
        // Hide all divs first
        paymentLoadingDiv.style.display = 'none';
        paymentPaidDiv.style.display = 'none';
        paymentDueDiv.style.display = 'none';
        paymentErrorDiv.style.display = 'none';

        switch (data.paymentStatus) {
            case 'paid':
                if (lastPaymentDateSpan) lastPaymentDateSpan.textContent = formatDate(data.lastPayment?.date);
                if (lastPaymentAmountSpan) lastPaymentAmountSpan.textContent = `$${parseFloat(data.lastPayment?.amount || 0).toFixed(2)}`;
                if (viewReceiptsLink) viewReceiptsLink.href = data.receiptHistoryUrl || '#';
                paymentPaidDiv.style.display = 'block';
                break;
            case 'due':
            case 'overdue': // Treat overdue same as due visually for now
                if (nextPaymentAmountSpan) nextPaymentAmountSpan.textContent = `$${parseFloat(data.nextPayment?.amount || 0).toFixed(2)}`;
                if (paymentDueDateSpan) paymentDueDateSpan.textContent = formatDate(data.nextPayment?.dueDate);
                if (viewReceiptsLink) viewReceiptsLink.href = data.receiptHistoryUrl || '#'; // Still show history link
                paymentDueDiv.style.display = 'block';
                break;
             case 'error':
                 paymentErrorDiv.style.display = 'block';
                 break;
            default: // Loading or unknown
                paymentLoadingDiv.style.display = 'flex'; // Show loading if status unknown
                console.warn("Unknown payment status:", data.paymentStatus);
        }
    }


    // --- Setup Action Button Listeners (Placeholders) ---
    function setupActionListeners(data) {
        const addClickListenerOnce = (element, handler) => {
            if (element && !element.hasAttribute('data-listener-set')) {
                element.addEventListener('click', handler);
                element.setAttribute('data-listener-set', 'true');
            }
        };

        // Header Buttons
        addClickListenerOnce(inboxButton, () => alert('ACTION: Open Inbox (Placeholder)'));
        addClickListenerOnce(notificationsButton, () => alert('ACTION: Show Notifications (Placeholder)'));
        addClickListenerOnce(logoutButton, () => alert('ACTION: Logout (Placeholder)'));

        // Main Buttons/Links
        addClickListenerOnce(makePaymentButtonMain, () => alert('ACTION: Initiate Payment Process (Placeholder)'));
        addClickListenerOnce(viewReceiptsLink, (e) => {
            e.preventDefault(); alert(`ACTION: View Payment History (Placeholder URL: ${data.receiptHistoryUrl || '#'})`);
        });
         addClickListenerOnce(retryPaymentLoadButton, () => {
             alert('ACTION: Retrying payment load (Placeholder)');
             // In real app, would call the fetch function again
             paymentErrorDiv.style.display = 'none';
             paymentLoadingDiv.style.display = 'flex';
             // Simulate refetch
             setTimeout(() => populateDashboard(mockData), 1000);
         });


        // Quick Links
        addClickListenerOnce(documentsLink, (e) => { e.preventDefault(); alert('ACTION: Go to Documents (Placeholder)'); });
        addClickListenerOnce(messagesLink, (e) => { e.preventDefault(); alert('ACTION: Go to Messages (Placeholder)'); });
        addClickListenerOnce(videosLink, (e) => { e.preventDefault(); alert('ACTION: Go to Videos (Placeholder)'); });
        addClickListenerOnce(profileLink, (e) => { e.preventDefault(); alert('ACTION: Go to Profile (Placeholder)'); });

        // Action Items Buttons (Delegate event listening for dynamic buttons)
        if (actionItemsList && !actionItemsList.hasAttribute('data-listener-set')) {
            actionItemsList.addEventListener('click', (event) => {
                const button = event.target.closest('.cta-button');
                if (button) {
                    const actionType = button.dataset.action;
                    const docId = button.dataset.docId;
                    // Add more dataset checks if needed (invoiceId, uploadId)
                    alert(`ACTION: Perform Action '${actionType}' ${docId ? `for doc ${docId}` : ''} (Placeholder)`);
                }
            });
            actionItemsList.setAttribute('data-listener-set', 'true');
        }
    }

    // --- Helper Function ---
    function formatDate(dateString) {
        if (!dateString) return '--/--/----';
        try {
            const date = new Date(dateString);
             // Adjust for potential timezone issues if dateString is just YYYY-MM-DD
            const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { return dateString; } // Return original if formatting fails
    }

    // --- Initialize View ---
    populateDashboard(mockData); // Populate directly

    // Setup animations using Intersection Observer
    // Note: Run this *after* populating the dashboard so elements exist
    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px 0px -10% 0px', // Trigger near bottom
        threshold: 0.1 // 10% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on element's order in the list it was queried from
                entry.target.style.transitionDelay = `${index * 0.08}s`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Observe the main cards and sections
    const elementsToAnimate = document.querySelectorAll('.card-style, .quick-link-card');
    if (elementsToAnimate.length > 0) {
        console.log(`Observing ${elementsToAnimate.length} elements for scroll animation.`);
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
    } else {
        console.warn("No elements found for dashboard scroll animation.");
    }

}); // End DOMContentLoaded