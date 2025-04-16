document.addEventListener('DOMContentLoaded', () => {
    console.log('Client Dashboard Mobile JS Initialized (View Mode).');

    // --- Essential DOM Element References ---
    const loader = document.getElementById('loader');
    const dashboardContent = document.querySelector('.dashboard-protected-content');
    const clientNameSpan = document.getElementById('client-name');
    // User info elements (can be left as placeholders in view mode)
    // const userEmailDisplay = document.getElementById('user-email-display');
    // const logoutButton = document.getElementById('logout-button');
    // const userInfoDiv = document.getElementById('user-info');

    // Card Specific Elements
    const caseStatusIndicator = document.getElementById('case-status-indicator');
    const caseStatusText = document.getElementById('case-status-text');
    const caseStatusUpdated = document.getElementById('case-status-updated');

    const paymentSection = document.getElementById('payment-section');
    const paymentLoadingDiv = paymentSection.querySelector('.payment-content-loading');
    const paymentDueDiv = paymentSection.querySelector('.payment-content-due');
    const paymentPaidDiv = paymentSection.querySelector('.payment-content-paid');
    const paymentErrorDiv = paymentSection.querySelector('.payment-content-error');
    const paymentDueAmount = document.getElementById('payment-due-amount');
    const paymentDate = document.getElementById('payment-date');
    const makePaymentButton = document.getElementById('make-payment-button');
    const viewReceiptLink = document.getElementById('view-receipt-link');

    const messageBadge = document.getElementById('message-count-badge');
    const viewMessagesLink = document.getElementById('view-messages-link');

    const signatureStatusText = document.getElementById('signature-status-text');
    const signatureBadge = document.getElementById('signature-required-badge');
    const signatureLink = document.getElementById('signature-link');

    const viewVideosLink = document.getElementById('view-videos-link');


    // --- MOCK DATA (Used directly now) ---
    const mockData = {
        clientName: "Example Client Inc.", // Placeholder name
        caseStatus: "pending_review",
        caseStatusText: "Pending DOL Review",
        caseStatusUpdated: "2023-10-26",
        // --- >> CHANGE THIS << to 'paid' or 'due' to see different payment states ---
        paymentStatus: "due",
        // ---------------------------------------------------------------------------
        paymentDueAmount: "1500.00",
        lastPaymentDate: "2023-09-15", // Used if status is 'paid'
        receiptUrl: "#view-receipt-placeholder", // Placeholder URL
        unreadMessages: 2,
        // --- >> CHANGE THIS << to false to hide the signature alert ---
        signatureRequired: true,
        // -------------------------------------------------------------
        signatureStatusText: "Employment agreement requires signature.",
    };
    // --- End Mock Data ---

    // --- Populate Dashboard Directly ---
    function populateDashboard(data) {
        if (!data) {
            console.error("Mock data is missing!");
            return;
        }
        console.log("Populating dashboard with MOCK data:", data);

        // Welcome Message
        if (clientNameSpan) {
            clientNameSpan.textContent = data.clientName || 'Client';
            clientNameSpan.classList.remove('client-name-placeholder');
        }

        // Case Status
        if (caseStatusText) caseStatusText.textContent = data.caseStatusText || 'Unavailable';
        if (caseStatusUpdated) caseStatusUpdated.textContent = formatDate(data.caseStatusUpdated) || '--/--/----';
        if (caseStatusIndicator) {
            caseStatusIndicator.className = 'status-indicator'; // Reset
            switch (data.caseStatus) {
                case 'approved': caseStatusIndicator.classList.add('status-good'); break;
                case 'action_required': case 'denied': caseStatusIndicator.classList.add('status-action'); break;
                case 'pending_review': case 'submitted': caseStatusIndicator.classList.add('status-pending'); break;
                default: caseStatusIndicator.classList.add('status-info');
            }
        }

        // Payment Section
        updatePaymentSection(data);

        // Inbox Badge
        if (messageBadge) {
            const count = data.unreadMessages || 0;
            messageBadge.textContent = count;
            messageBadge.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        // Signature Section
        if(signatureStatusText) signatureStatusText.textContent = data.signatureRequired ? (data.signatureStatusText || "Action required on documents.") : "No documents currently require action.";
        if (signatureBadge) signatureBadge.style.display = data.signatureRequired ? 'inline-flex' : 'none';
        const sigCard = document.querySelector('.signature-card');
        if (sigCard) sigCard.setAttribute('data-action-required', data.signatureRequired);

        // Add Event Listeners (still useful for seeing button interactions)
        setupActionListeners(data);
    }

    // --- Update Payment Section Logic ---
    function updatePaymentSection(data) {
         // Hide all payment content initially
        paymentLoadingDiv.style.display = 'none';
        paymentDueDiv.style.display = 'none';
        paymentPaidDiv.style.display = 'none';
        paymentErrorDiv.style.display = 'none';

         const status = data.paymentStatus;
         paymentSection.setAttribute('data-status', status || 'unknown');

         if (status === 'due' || status === 'overdue') {
             if (paymentDueAmount) paymentDueAmount.textContent = `$${parseFloat(data.paymentDueAmount || 0).toFixed(2)}`;
             paymentDueDiv.style.display = 'block';
         } else if (status === 'paid') {
             if (paymentDate) paymentDate.textContent = formatDate(data.lastPaymentDate) || '--/--/----';
             if (viewReceiptLink) viewReceiptLink.href = data.receiptUrl || '#';
             paymentPaidDiv.style.display = 'block';
         } else {
             console.log("Payment status unknown or needs specific handling:", status);
             paymentErrorDiv.style.display = 'block'; // Show error for unknown states now
             paymentSection.setAttribute('data-status', 'error');
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

        addClickListenerOnce(makePaymentButton, () => {
            alert("ACTION: Proceed to Payment (Placeholder)");
        });

        addClickListenerOnce(viewReceiptLink, (e) => {
            e.preventDefault();
            alert(`ACTION: View Receipt (Placeholder URL: ${data.receiptUrl || '#'})`);
        });

        addClickListenerOnce(viewMessagesLink, (e) => {
            e.preventDefault(); alert("ACTION: Open Inbox (Placeholder)");
        });

        addClickListenerOnce(signatureLink, (e) => {
            e.preventDefault(); alert("ACTION: Review Documents (Placeholder)");
        });

        addClickListenerOnce(viewVideosLink, (e) => {
            e.preventDefault(); alert("ACTION: View Videos (Placeholder)");
        });

        // Logout button listener removed as Firebase is removed
         const logoutButton = document.getElementById('logout-button');
         if (logoutButton) {
            addClickListenerOnce(logoutButton, (e) => {
                e.preventDefault();
                alert("ACTION: Logout (Placeholder - Would normally redirect to login)");
            });
         }
    }

    // --- Helper Function ---
    function formatDate(dateString) {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { return dateString; }
    }

    // --- Initialize View ---
    // Hide loader immediately
    if (loader) loader.classList.add('hidden');

    // Make dashboard content visible (already done via class in HTML, but ensure)
    if (dashboardContent) dashboardContent.classList.add('visible');

    // Populate with mock data
    populateDashboard(mockData);

    // Setup animations (Optional for view mode, but keeps the effect)
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Find '[data-animation]' within the visible entry
                const animatedElement = entry.target.querySelector('[data-animation]') || entry.target;
                 if (animatedElement.hasAttribute('data-animation')){
                     animatedElement.classList.add('is-visible');
                     observer.unobserve(entry.target); // Unobserve the container/card
                 }
            }
        });
    };
    // Observe the CARDS now, not the inner elements with data-animation attribute directly
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToObserve = document.querySelectorAll('.dashboard-card, .welcome-section'); // Observe cards/sections
    if (elementsToObserve.length > 0) {
         console.log(`Observing ${elementsToObserve.length} dashboard elements for scroll animation.`);
         elementsToObserve.forEach(el => scrollObserver.observe(el));
    }

    // Update footer year (If footer exists)
    // const footerYearSpan = document.getElementById('current-year');
    // if (footerYearSpan) footerYearSpan.textContent = new Date().getFullYear();

}); // End DOMContentLoaded