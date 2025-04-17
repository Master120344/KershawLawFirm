document.addEventListener('DOMContentLoaded', () => {
    console.log('Desktop Client Dashboard JS Initialized.');

    // --- Global State (Represents a NEW USER login) ---
    const AppState = { /* ... (AppState remains the same as previous step) ... */
        clientName: "New Client Example Inc.",
        visaType: "H-2A",
        caseId: null,
        caseStatus: "initial_review",
        caseProgressPercent: 5,
        estimatedCompletion: "TBD",
        paymentStatus: "signing_required",
        feeAgreementSigned: false,
        lastPayment: null,
        nextPayment: { amount: "1500.00", dueDate: null, invoiceId: "invKLR-Initial" },
        receiptHistoryUrl: "#/billing/history",
        feeAgreementUrl: "#/documents/fee-agreement",
        unreadMessages: 0, // No messages for new user
        unreadNotifications: 2, // START WITH SOME UNREAD NOTIFS for demo
        actionsRequired: [
            { type: 'signature', description: 'Review and sign the Fee Agreement to begin case processing.', docId: 'fee-agreement-initial', requiresAgreement: false },
            { type: 'payment', description: 'Initial retainer payment required after agreement signing.', invoiceId: 'invKLR-Initial', requiresAgreement: true }
        ],
        dashboardUrl: "#dashboard",
        caseDetailsUrl: "#/case/details",
        documentsUrl: "#/documents",
        paymentsUrl: "#/payments",
        messagesUrl: "#/messaging",
        profileUrl: "#/profile",
        resourcesUrl: "#/resources",
        logoutUrl: "/logout"
    };

    // --- DOM Element References ---
    const DOM = {
        // Sidebar
        sidebarNavLinks: document.querySelectorAll('.sidebar-nav .nav-link'),
        clientNameSidebar: document.getElementById('client-name-sidebar'),
        logoutButtonSidebar: document.getElementById('logout-button-sidebar'),
        inboxBadgeSidebar: document.getElementById('inbox-badge-sidebar'),

        // Header
        pageTitleDesktop: document.getElementById('page-title-desktop'),
        headerActionsDesktop: document.querySelector('.header-actions-desktop'), // Needed for notification panel insertion
        notificationsButtonDesktop: document.getElementById('notifications-button-desktop'), // Needed for notification logic
        notificationsBadgeDesktop: document.getElementById('notifications-badge-desktop'), // Needed for notification logic

        // Main Content Area
        contentArea: document.querySelector('.content-area-desktop'),
        allContentSections: document.querySelectorAll('.content-area-desktop .content-section'),

        // Action Required Section
        actionRequiredSectionDesktop: document.getElementById('action-required-section-desktop'),
        actionItemsListDesktop: document.getElementById('action-items-list-desktop'),

        // Case Status Card
        caseStatusIconDesktop: document.getElementById('case-status-icon-desktop'),
        caseStatusTextDetailedDesktop: document.getElementById('case-status-text-detailed-desktop'),
        progressBarInnerDesktop: document.getElementById('progress-bar-inner-desktop'),
        progressPercentageDesktop: document.getElementById('progress-percentage-desktop'),
        estimatedCompletionDesktop: document.getElementById('estimated-completion-desktop'),
        visaTypeDesktop: document.getElementById('visa-type-desktop'),
        viewCaseDetailsBtnDesktop: document.getElementById('view-case-details-btn-desktop'),

        // Payment Card
        paymentSummaryDesktop: document.getElementById('payment-summary-desktop'),
        paymentLoadingDivDesktop: document.getElementById('payment-content-loading-desktop'),
        paymentPaidDivDesktop: document.getElementById('payment-content-paid-desktop'),
        paymentDueDivDesktop: document.getElementById('payment-content-due-desktop'),
        paymentErrorDivDesktop: document.getElementById('payment-content-error-desktop'),
        lastPaymentDateDesktop: document.getElementById('last-payment-date-desktop'),
        lastPaymentAmountDesktop: document.getElementById('last-payment-amount-desktop'),
        nextPaymentAmountDesktop: document.getElementById('next-payment-amount-desktop'),
        paymentDueDateDesktop: document.getElementById('payment-due-date-desktop'),
        makePaymentButtonMainDesktop: document.getElementById('make-payment-button-main-desktop'),
        viewReceiptsPaidDesktop: document.getElementById('view-receipts-paid-desktop'),
        viewReceiptsDueDesktop: document.getElementById('view-receipts-due-desktop'),
        retryPaymentLoadDesktop: document.getElementById('retry-payment-load-desktop'),
        paymentAgreementNoticeDesktop: document.getElementById('payment-agreement-notice-desktop'),
        feeAgreementLinkDesktop: document.getElementById('fee-agreement-link-desktop'),
        signAgreementBtnDesktop: document.getElementById('sign-agreement-btn-desktop'),

        // Quick Access Links
        documentsLinkDesktop: document.getElementById('documents-link-desktop'),
        messagesLinkDesktop: document.getElementById('messages-link-desktop'),
        resourcesLinkDesktop: document.getElementById('resources-link-desktop'),
        profileLinkDesktop: document.getElementById('profile-link-desktop'),
        messagesQuickBadgeDesktop: document.getElementById('messages-quick-badge-desktop'),

        // Case Details Modal Elements (Needed by modal logic)
        modalDesktop: document.getElementById('case-details-modal-desktop'),
        modalContentDesktop: document.querySelector('.modal-content-desktop'),
        modalCloseButtonDesktop: document.getElementById('case-details-close-btn-desktop'),
        modalTitleDesktop: document.getElementById('case-details-modal-title-desktop'),
        modalStepsListDesktop: document.getElementById('case-details-steps-list-desktop'),

        // Elements for Animation
        elementsToAnimate: document.querySelectorAll('.card-style-desktop, .quick-link-card-desktop')
    };

    // --- Helper Functions (Loaded from dashboard_helpers_desktop.js) ---

    // --- Populating Sections ---
    // populateActionItems function remains here
    // updatePaymentSection function remains here

    /**
     * Populates the Action Items section based on AppState.actionsRequired.
     * Uses helper functions getActionTitle and getActionButtonText.
     * @param {Array} actions - The array of action objects from AppState.
     */
    function populateActionItems(actions) {
        // Ensure dependencies are ready
        if (!DOM || !DOM.actionItemsListDesktop || !DOM.actionRequiredSectionDesktop || typeof getActionTitle === 'undefined' || typeof getActionButtonText === 'undefined') {
            console.error("Cannot populate action items: DOM elements or helper functions missing.");
            return;
        }
        DOM.actionItemsListDesktop.innerHTML = ''; // Clear previous items
        const relevantActions = actions || [];

        if (relevantActions.length > 0) {
            relevantActions.forEach(action => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'action-item-desktop'; // Use desktop class

                const descP = document.createElement('p');
                // Bolding the action type itself for emphasis
                descP.innerHTML = `<strong>${getActionTitle(action.type)}:</strong> ${action.description || 'Details unavailable.'}`;

                const actionButton = document.createElement('button');
                actionButton.className = 'cta-button-desktop secondary small-cta'; // Use desktop classes
                actionButton.textContent = getActionButtonText(action.type);
                // Add data attributes for handling clicks
                actionButton.dataset.action = action.type;
                if (action.docId) actionButton.dataset.docId = action.docId;
                if (action.invoiceId) actionButton.dataset.invoiceId = action.invoiceId;
                if (action.uploadId) actionButton.dataset.uploadId = action.uploadId;
                // Add requiresAgreement flag directly, will be checked in handler
                if (action.requiresAgreement) actionButton.dataset.requiresAgreement = 'true';

                itemDiv.appendChild(descP);
                itemDiv.appendChild(actionButton);
                DOM.actionItemsListDesktop.appendChild(itemDiv);
            });
            DOM.actionRequiredSectionDesktop.style.display = 'block'; // Show the section
        } else {
            DOM.actionRequiredSectionDesktop.style.display = 'none'; // Hide if no actions
        }
    }

    /**
     * Updates the Payment Summary card based on AppState.
     * Uses helper functions formatCurrency and formatDate.
     * @param {object} state - The AppState object.
     */
    function updatePaymentSection(state) {
        // Ensure dependencies are ready
        if (!DOM || !DOM.paymentSummaryDesktop || typeof formatCurrency === 'undefined' || typeof formatDate === 'undefined') {
             console.error("Cannot update payment section: DOM elements or helper functions missing.");
            return;
        }
        // Hide all content divs initially
        if (DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'none';
        if (DOM.paymentPaidDivDesktop) DOM.paymentPaidDivDesktop.style.display = 'none';
        if (DOM.paymentDueDivDesktop) DOM.paymentDueDivDesktop.style.display = 'none';
        if (DOM.paymentErrorDivDesktop) DOM.paymentErrorDivDesktop.style.display = 'none';
        if (DOM.paymentAgreementNoticeDesktop) DOM.paymentAgreementNoticeDesktop.style.display = 'none';
        if (DOM.signAgreementBtnDesktop) DOM.signAgreementBtnDesktop.style.display = 'none';
        // Reset make payment button state
        if (DOM.makePaymentButtonMainDesktop) {
             DOM.makePaymentButtonMainDesktop.disabled = false;
             DOM.makePaymentButtonMainDesktop.style.opacity = '1';
             DOM.makePaymentButtonMainDesktop.style.cursor = 'pointer';
        }


        switch (state.paymentStatus) {
            case 'paid':
                if (DOM.lastPaymentDateDesktop) DOM.lastPaymentDateDesktop.textContent = formatDate(state.lastPayment?.date);
                if (DOM.lastPaymentAmountDesktop) DOM.lastPaymentAmountDesktop.textContent = formatCurrency(state.lastPayment?.amount);
                if (DOM.viewReceiptsPaidDesktop) DOM.viewReceiptsPaidDesktop.dataset.url = state.receiptHistoryUrl || '#';
                if (DOM.paymentPaidDivDesktop) DOM.paymentPaidDivDesktop.style.display = 'block';
                break;

            case 'signing_required': // Handle the state where agreement needs signing first
            case 'due':
                 if (DOM.nextPaymentAmountDesktop) DOM.nextPaymentAmountDesktop.textContent = formatCurrency(state.nextPayment?.amount);
                 if (DOM.paymentDueDateDesktop) DOM.paymentDueDateDesktop.textContent = formatDate(state.nextPayment?.dueDate); // May be null initially
                 if (DOM.viewReceiptsDueDesktop) DOM.viewReceiptsDueDesktop.dataset.url = state.receiptHistoryUrl || '#';
                 if (DOM.makePaymentButtonMainDesktop) DOM.makePaymentButtonMainDesktop.dataset.invoiceId = state.nextPayment?.invoiceId || '';

                 // Check if the primary action is signing or if payment depends on it
                 const requiresSigning = !state.feeAgreementSigned;

                 if (requiresSigning) {
                     // Update status text specifically for this state if needed
                     const statusTextElement = DOM.paymentDueDivDesktop?.querySelector('.payment-status-text-desktop.warning i');
                     if(statusTextElement) {
                         // Optionally change icon/text if agreement is the blocker
                         // statusTextElement.className = 'fa-solid fa-file-signature'; // Example icon change
                     }

                     // Show notice and sign button
                     if (DOM.paymentAgreementNoticeDesktop) DOM.paymentAgreementNoticeDesktop.style.display = 'inline-flex';
                     if (DOM.signAgreementBtnDesktop) DOM.signAgreementBtnDesktop.style.display = 'inline-block';
                     if (DOM.feeAgreementLinkDesktop) DOM.feeAgreementLinkDesktop.href = state.feeAgreementUrl || '#';

                     // Disable payment button
                     if (DOM.makePaymentButtonMainDesktop) {
                        DOM.makePaymentButtonMainDesktop.disabled = true;
                        DOM.makePaymentButtonMainDesktop.style.opacity = '0.6';
                        DOM.makePaymentButtonMainDesktop.style.cursor = 'not-allowed';
                     }

                 } else {
                     // Fee agreement IS signed, but payment might still be due
                     // Ensure payment button is enabled
                      if (DOM.makePaymentButtonMainDesktop) {
                         DOM.makePaymentButtonMainDesktop.disabled = false;
                         DOM.makePaymentButtonMainDesktop.style.opacity = '1';
                         DOM.makePaymentButtonMainDesktop.style.cursor = 'pointer';
                     }
                     // Hide signing specific elements if they were shown before
                     if (DOM.paymentAgreementNoticeDesktop) DOM.paymentAgreementNoticeDesktop.style.display = 'none';
                     if (DOM.signAgreementBtnDesktop) DOM.signAgreementBtnDesktop.style.display = 'none';

                     // You might still want to show a link to the signed agreement for reference
                     // if (state.feeAgreementSigned && state.feeAgreementUrl) { ... }
                 }
                 if (DOM.paymentDueDivDesktop) DOM.paymentDueDivDesktop.style.display = 'block';
                break;

             case 'error':
                 if (DOM.paymentErrorDivDesktop) DOM.paymentErrorDivDesktop.style.display = 'block';
                 break;

            default: // Includes loading state potentially
                if (DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'flex';
        }
    }

    // --- Main Dashboard Population ---
    /**
     * Populates the entire dashboard with data from AppState.
     * Calls sub-functions for specific sections and sets up initial state.
     * @param {object} data - The AppState object.
     */
    function populateDashboard(data) {
        if (!data) { console.error("Data missing for dashboard population!"); return; }
        // Ensure helper functions are loaded
        if (typeof updateBadge === 'undefined' || typeof getStatusTextAndClass === 'undefined' || typeof updateStatusIcon === 'undefined') {
             console.error("Helper functions not loaded. Cannot populate dashboard.");
             return;
        }

        // Sidebar & Header Badges/Info
        if (DOM.clientNameSidebar) DOM.clientNameSidebar.textContent = data.clientName || 'Valued Client';
        updateBadge(DOM.inboxBadgeSidebar, data.unreadMessages);
        // Update notification badge using data from AppState (will be refined by notification script later)
        updateBadge(DOM.notificationsBadgeDesktop, data.unreadNotifications);
        updateBadge(DOM.messagesQuickBadgeDesktop, data.unreadMessages);

        // Action Required Banner
        populateActionItems(data.actionsRequired);

        // Case Status Card
        const statusInfo = getStatusTextAndClass(data.caseStatus);
        if (DOM.caseStatusTextDetailedDesktop) DOM.caseStatusTextDetailedDesktop.textContent = statusInfo.text;
        if (DOM.caseStatusIconDesktop) updateStatusIcon(DOM.caseStatusIconDesktop, statusInfo.class);
        const progress = Math.max(0, Math.min(100, data.caseProgressPercent || 0));
        if (DOM.progressBarInnerDesktop) DOM.progressBarInnerDesktop.style.width = `${progress}%`;
        if (DOM.progressPercentageDesktop) DOM.progressPercentageDesktop.textContent = `${progress}%`;
        if (DOM.estimatedCompletionDesktop) DOM.estimatedCompletionDesktop.textContent = data.estimatedCompletion || 'TBD';
        if (DOM.visaTypeDesktop) DOM.visaTypeDesktop.textContent = data.visaType || 'H-2A/B';
        if (DOM.viewCaseDetailsBtnDesktop) DOM.viewCaseDetailsBtnDesktop.dataset.url = data.caseDetailsUrl || '#';

        // Payment Card
        updatePaymentSection(data);

        // Setup Quick Access Links
        if (DOM.documentsLinkDesktop) DOM.documentsLinkDesktop.href = data.documentsUrl || '#';
        if (DOM.messagesLinkDesktop) DOM.messagesLinkDesktop.href = data.messagesUrl || '#';
        if (DOM.resourcesLinkDesktop) DOM.resourcesLinkDesktop.href = data.resourcesUrl || '#';
        if (DOM.profileLinkDesktop) DOM.profileLinkDesktop.href = data.profileUrl || '#';

        // Set initial page title
        if (DOM.pageTitleDesktop) DOM.pageTitleDesktop.textContent = 'Dashboard Overview';

        // --- Setup Listeners and Other Logic ---
        setupActionListeners(data);    // Setup button/link clicks in dashboard cards/actions
        setupSidebarNavigation();      // Setup main navigation links

        // Setup Modal Logic (Ensure function exists from modal script)
        if (typeof setupModalLogicDesktop === 'function') {
            setupModalLogicDesktop();
        } else {
            console.error("setupModalLogicDesktop function not found. Modal will not work.");
        }

        // Setup Notification Logic (Ensure function exists from notification script)
        if (typeof setupNotificationLogicDesktop === 'function') {
            setupNotificationLogicDesktop();
        } else {
            console.error("setupNotificationLogicDesktop function not found. Notifications will not work.");
        }

        // Setup animations (Optional)
        setupScrollAnimations();
    }

    // --- Event Listeners & Navigation ---
    // setupActionListeners function remains here
    // setupSidebarNavigation function remains here
    // handleActionItemClick function remains here
    // navigateTo function remains here
    // initiatePayment function remains here
        /**
     * Adds event listeners to static and dynamic elements on the dashboard.
     * Uses a helper to prevent adding duplicate listeners.
     * @param {object} state - The AppState object (for URLs, etc.).
     */
    function setupActionListeners(state) {
        const addClickListenerOnce = (element, handler) => { // Helper to prevent multiple listeners
            if (element && !element.hasAttribute('data-listener-set')) {
                element.addEventListener('click', handler);
                element.setAttribute('data-listener-set', 'true');
            } else if (!element) {
                 // console.warn("Attempted to add listener to non-existent element.");
            }
        };

        // --- Static Element Listeners ---
        // Note: Notification button listener is now handled in notifications_desktop.js
        // addClickListenerOnce(DOM.notificationsButtonDesktop, () => alert('Notifications Panel (Desktop Placeholder)')); // REMOVED

        addClickListenerOnce(DOM.logoutButtonSidebar, (e) => {
             e.preventDefault(); // Prevent default link behavior
             if (confirm('Are you sure you want to logout?')) {
                 console.log('Logging out...');
                 // window.location.href = state.logoutUrl || '/'; // Uncomment for actual logout
             }
        });
        addClickListenerOnce(DOM.makePaymentButtonMainDesktop, (e) => {
             if (e.target.disabled) return; // Don't process if disabled (e.g., needs agreement)
             initiatePayment(e.target.dataset.invoiceId);
        });
        addClickListenerOnce(DOM.viewReceiptsPaidDesktop, (e) => navigateTo(e.target.dataset.url, 'Payment History'));
        addClickListenerOnce(DOM.viewReceiptsDueDesktop, (e) => navigateTo(e.target.dataset.url, 'Payment History'));
        addClickListenerOnce(DOM.signAgreementBtnDesktop, () => navigateTo(state.feeAgreementUrl, 'Fee Agreement'));
        addClickListenerOnce(DOM.retryPaymentLoadDesktop, () => {
             console.log("Retrying payment load...");
             if(DOM.paymentErrorDivDesktop) DOM.paymentErrorDivDesktop.style.display = 'none';
             if(DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'flex';
             // In a real app, you'd call the API again here.
             // Simulating refetch with existing state for now:
             setTimeout(() => updatePaymentSection(AppState), 300);
         });

         // --- Quick Access Links (using navigation function via click listener) ---
         addClickListenerOnce(DOM.documentsLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.documentsUrl, 'Documents'); });
         addClickListenerOnce(DOM.messagesLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.messagesUrl, 'Secure Messages'); }); // Updated text
         addClickListenerOnce(DOM.resourcesLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.resourcesUrl, 'H-2 Resources'); });
         addClickListenerOnce(DOM.profileLinkDesktop, (e) => { e.preventDefault(); navigateTo(state.profileUrl, 'My Profile'); });

         // --- Dynamic Element Listener (Event Delegation on Action Items List) ---
        if (DOM.actionItemsListDesktop && !DOM.actionItemsListDesktop.hasAttribute('data-listener-set')) {
            DOM.actionItemsListDesktop.addEventListener('click', (event) => {
                const button = event.target.closest('.cta-button-desktop'); // Target the button
                if (button && button.dataset.action) {
                    handleActionItemClick(button.dataset); // Pass the dataset of the clicked button
                }
            });
            DOM.actionItemsListDesktop.setAttribute('data-listener-set', 'true');
        }
    }

    /**
     * Sets up click handlers for the main sidebar navigation links.
     * Handles showing/hiding content sections and updating the page title.
     */
    function setupSidebarNavigation() {
        DOM.sidebarNavLinks.forEach(link => {
            // Ensure listener is added only once per link
            if (!link.hasAttribute('data-listener-set')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Stop default anchor behavior

                    const targetId = link.dataset.target;
                    const targetSection = document.getElementById(targetId);
                    // Find the span inside the link for the title, fallback to link text
                    const pageTitle = link.querySelector('span')?.textContent || link.textContent || 'Section';

                    // Update active link styling
                    DOM.sidebarNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Show target section, hide others
                    DOM.allContentSections.forEach(section => {
                        section.classList.remove('active'); // Hide all
                    });

                    if (targetSection) {
                        targetSection.classList.add('active'); // Show the target
                        // Optional: Trigger fade-in or other transition if needed
                        // targetSection.style.animation = 'fadeIn 0.5s ease-out'; // Re-trigger animation? careful with this.
                    } else {
                        // Fallback: If target section is missing, show dashboard overview
                        const overview = document.getElementById('dashboard-overview');
                        if(overview) overview.classList.add('active');
                        console.warn(`Target section #${targetId} not found. Showing Dashboard Overview.`);
                        // --- Placeholder for Dynamic Content Loading ---
                        // If sections like 'documents-section' should load content dynamically:
                        // if (targetId === 'documents-section') {
                        //     loadDocumentsContent(DOM.contentArea); // Example function call
                        // } else {
                        //     alert(`Placeholder: Load dynamic content for "${pageTitle}" into section #${targetId}`);
                        // }
                        // For now, we only switch visibility of existing divs.
                        alert(`Placeholder: Section "${pageTitle}" (${targetId}) content not implemented yet.`);
                    }

                    // Update header title to match the selected section
                    if (DOM.pageTitleDesktop) DOM.pageTitleDesktop.textContent = pageTitle;

                    // Scroll to top of the main content area for better UX
                    if(DOM.contentArea) DOM.contentArea.scrollTo({ top: 0, behavior: 'smooth' });
                });
                link.setAttribute('data-listener-set', 'true'); // Mark listener as added
            }
        });
    }

    /**
     * Handles clicks on buttons within the 'Action Required' list.
     * @param {DOMStringMap} dataset - The dataset object from the clicked button.
     */
    function handleActionItemClick(dataset) {
        const { action, docId, invoiceId, uploadId, requiresAgreement } = dataset;
        console.log("Handling action:", action, "Data:", dataset);

        // Pass the requiresAgreement status to initiatePayment if it's a payment action
        const needsAgreementCheck = requiresAgreement === 'true';

        switch (action) {
            case 'payment':
                initiatePayment(invoiceId, needsAgreementCheck);
                break;
            case 'signature':
                // Navigate to the specific document signing page/view
                navigateTo(AppState.feeAgreementUrl || `#/documents/sign/${docId}`, `Sign Document ${docId || 'Fee Agreement'}`);
                break;
            case 'information':
                 // Navigate to a form or profile section
                 navigateTo(`#/forms/provide/${uploadId || 'info'}`, `Provide Information ${uploadId || ''}`);
                break;
            case 'upload':
                // Navigate to a document upload interface
                navigateTo(`#/documents/upload/${uploadId}`, `Upload Document ${uploadId}`);
                break;
            default:
                console.warn(`Unhandled action type: ${action}`);
                alert(`Action: ${action} (Placeholder - No specific navigation defined)`);
        }
    }

    /**
     * Basic navigation handler (Simulates SPA routing or triggers alerts).
     * @param {string|null|undefined} url - The target URL or hash.
     * @param {string} targetDescription - A user-friendly description for logs/alerts.
     */
    function navigateTo(url, targetDescription) {
        console.log(`Navigating to ${targetDescription} at ${url}`);
        if (!url) {
             alert(`${targetDescription} navigation URL not configured or is invalid.`);
             return;
        }

        // Check if URL corresponds to a sidebar section
        let sidebarLinkClicked = false;
        if (url.startsWith('#')) {
            // Try to match #/section or #section-name to a data-target
            const potentialTargetId = url.startsWith('#/') ? url.substring(2).split('/')[0] + '-section' : url.substring(1);
            const targetLink = document.querySelector(`.nav-link[data-target='${potentialTargetId}']`);

            if (targetLink) {
                targetLink.click(); // Simulate clicking the sidebar link
                sidebarLinkClicked = true;
            }
        }

        // If it wasn't a direct sidebar link click, handle as placeholder/external
        if (!sidebarLinkClicked) {
            if (url.startsWith('#/')) {
                // Placeholder for more complex SPA routing (e.g., loading specific payment form)
                alert(`Placeholder SPA Navigation to: ${targetDescription} (${url})`);
                // Example: If url is #/payments/pay/inv123, load payment form for inv123
            } else if (url.startsWith('#')) {
                // Simple hash change, maybe scroll? Not handled here currently.
                alert(`Placeholder Hash Navigation: ${targetDescription} (${url})`);
            } else { // Assume external link or full page load
                alert(`Opening external link or page: ${targetDescription} (URL: ${url})`);
                // window.location.href = url; // Uncomment for actual redirection
            }
        }
    }

    /**
     * Simulates initiating a payment process. Checks for fee agreement requirement.
     * @param {string|null|undefined} invoiceId - The ID of the invoice to pay.
     * @param {boolean} [requiresAgreement=false] - Does this payment require a signed agreement first?
     */
    function initiatePayment(invoiceId, requiresAgreement = false) {
        if (!invoiceId) {
            alert('Error: Invoice ID is missing. Cannot initiate payment.');
            console.error('Payment initiation failed: Missing invoiceId.');
            return;
        }

        // Check if agreement is required AND if it's not signed according to AppState
        if (requiresAgreement && !AppState.feeAgreementSigned) {
             alert('Please review and sign the Fee Agreement before proceeding with this payment.');
             // Optional: Highlight the agreement notice/button
             if(DOM.signAgreementBtnDesktop) {
                 DOM.signAgreementBtnDesktop.focus();
                 DOM.signAgreementBtnDesktop.style.outline = '2px solid var(--color-error)'; // Use error color for emphasis
                 setTimeout(() => { if(DOM.signAgreementBtnDesktop) DOM.signAgreementBtnDesktop.style.outline = 'none'; }, 3500);
             }
             return; // Stop payment process
        }

        // If agreement is signed or not required, proceed to payment navigation/simulation
        const paymentUrl = `#/payments/pay/${invoiceId}`; // Example SPA route for payment form
        console.log(`Initiating payment for Invoice: ${invoiceId}, Agreement required: ${requiresAgreement}, Signed: ${AppState.feeAgreementSigned}`);
        alert(`Simulating navigation to payment page for Invoice: ${invoiceId}\n(Placeholder URL: ${paymentUrl})`);
        navigateTo(paymentUrl, `Payment for ${invoiceId}`);
        // In a real app, this would likely redirect to Stripe, LawPay, or show an embedded payment form.
    }


    // --- Animations (Optional - Basic Fade/Slide In on Scroll) ---
    function setupScrollAnimations() {
         // Check for IntersectionObserver support and elements to animate
         if (!('IntersectionObserver' in window) || !DOM.elementsToAnimate || DOM.elementsToAnimate.length === 0) {
             console.warn("IntersectionObserver not supported or no elements found to animate.");
              // Make elements visible immediately if no animation support/targets
             if (DOM.elementsToAnimate) {
                DOM.elementsToAnimate.forEach(el => { el.style.opacity = 1; el.style.transform = 'translateY(0)'; });
             }
             return;
         }

         const observerOptions = {
             root: null, // Use viewport as root
             rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully visible
             threshold: 0.1 // 10% of element visible
         };

         const observerCallback = (entries, observer) => {
             entries.forEach((entry) => {
                 if (entry.isIntersecting) {
                     const element = entry.target;
                     // Apply final state styles (defined in CSS or JS)
                     element.style.opacity = 1;
                     element.style.transform = 'translateY(0)';
                     // Optional: Add a class instead of direct style manipulation if preferred
                     // element.classList.add('is-visible');
                     observer.unobserve(element); // Stop observing once animated
                 }
             });
         };

         const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

         DOM.elementsToAnimate.forEach(el => {
             // Set initial state for animation (hidden)
             el.style.opacity = 0;
             el.style.transform = 'translateY(20px)'; // Start slightly lower
             el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Define transition
             // Optional: Add a class for initial state if preferred
             // el.classList.add('will-animate');
             scrollObserver.observe(el); // Start observing
         });
    }

    // --- Initial Fetch and Render ---
    /**
     * Simulates fetching dashboard data and then populates the dashboard.
     */
    function fetchDashboardData() {
        console.log("Fetching desktop dashboard data (simulation)...");
        // Show loading states if needed (e.g., for payment card)
        if(DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'flex';
        if(DOM.paymentDueDivDesktop) DOM.paymentDueDivDesktop.style.display = 'none'; // Hide other states
        if(DOM.paymentPaidDivDesktop) DOM.paymentPaidDivDesktop.style.display = 'none';
        if(DOM.paymentErrorDivDesktop) DOM.paymentErrorDivDesktop.style.display = 'none';

        // Simulate network delay with setTimeout
        setTimeout(() => {
            console.log("Received data (using mock 'new user' data for desktop).");
            // Hide loading indicator *before* populating sections that replace it
            if(DOM.paymentLoadingDivDesktop) DOM.paymentLoadingDivDesktop.style.display = 'none';

            // Populate dashboard with the AppState data
            populateDashboard(AppState); // This now calls setupNotificationLogicDesktop internally

        }, 600); // Simulate 600ms delay
    }

    // --- Run Initialization ---
    fetchDashboardData(); // Start the process when the DOM is ready

}); // End DOMContentLoaded
