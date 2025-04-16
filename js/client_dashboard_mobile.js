document.addEventListener('DOMContentLoaded', () => {
    console.log('Client Dashboard Mobile JS Initialized (View Mode - Simplified).');

    // --- Essential DOM Element References ---
    // Loader removed from default HTML, so no need to hide it
    // const loader = document.getElementById('loader');
    // const dashboardContent = document.querySelector('.main-content-area'); // Content is always visible now

    const clientNameSpan = document.getElementById('client-name');
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


    // --- MOCK DATA ---
    const mockData = {
        clientName: "Visible Client Ltd.", // Updated Name
        caseStatus: "approved", // Example: Approved status
        caseStatusText: "Visa Approved",
        caseStatusUpdated: "2023-11-01",
        // --- >> CHANGE THIS << to 'paid' or 'due' to see different payment states ---
        paymentStatus: "paid",
        // ---------------------------------------------------------------------------
        paymentDueAmount: "1500.00",
        lastPaymentDate: "2023-10-15", // Used if status is 'paid'
        receiptUrl: "#view-receipt-placeholder", // Placeholder URL
        unreadMessages: 0, // No new messages example
        // --- >> CHANGE THIS << to true to show the signature alert ---
        signatureRequired: false,
        // -------------------------------------------------------------
        signatureStatusText: "Employment agreement requires signature.", // Text shown if required=true
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

        // Add Event Listeners (Placeholders)
        setupActionListeners(data);
    }

    // --- Update Payment Section Logic ---
    function updatePaymentSection(data) {
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
             paymentErrorDiv.style.display = 'block';
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

         // Logout button placeholder action
          const logoutButton = document.getElementById('logout-button');
          if (logoutButton) {
             addClickListenerOnce(logoutButton, (e) => {
                 e.preventDefault();
                 alert("ACTION: Logout (Placeholder)");
             });
          }
    }

    // --- Helper Function ---
    function formatDate(dateString) {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            // Simple format, adjust as needed
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        } catch (e) { return dateString; }
    }

    // --- Initialize View ---
    populateDashboard(mockData); // Populate directly

    // Setup animations (Optional)
    // Ensure this runs after the DOM is fully ready and populated
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    const observerCallback = (entries, observer) => {
         entries.forEach((entry) => {
             if (entry.isIntersecting) {
                 // Add 'is-visible' to trigger CSS animation
                 entry.target.classList.add('is-visible');
                 observer.unobserve(entry.target); // Animate only once
             }
         });
     };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.dashboard-card, .welcome-section'); // Observe cards/sections
    if (elementsToAnimate.length > 0) {
          console.log(`Observing ${elementsToAnimate.length} elements for scroll animation.`);
          elementsToAnimate.forEach(el => {
              // Add the data-animation attribute if missing, for simplicity in view mode
              if (!el.hasAttribute('data-animation')) {
                  el.setAttribute('data-animation', 'fade-in-up'); // Default animation
              }
              scrollObserver.observe(el)
          });
    }


}); // End DOMContentLoaded