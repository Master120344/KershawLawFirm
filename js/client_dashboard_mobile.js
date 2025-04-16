document.addEventListener('DOMContentLoaded', () => {
    console.log('Client Dashboard Mobile JS Initialized.');

    // --- Essential DOM Element References ---
    const loader = document.getElementById('loader');
    const dashboardContent = document.querySelector('.dashboard-protected-content'); // The main container to show/hide
    const clientNameSpan = document.getElementById('client-name');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutButton = document.getElementById('logout-button');
    const userInfoDiv = document.getElementById('user-info');

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

    // --- Authentication Check ---
    function handleAuthChange(user) {
        if (user) {
            // User is signed in.
            console.log('User authenticated:', user.uid);
            displayUserInfo(user);
            if(loader) loader.classList.remove('hidden'); // Show loader
            fetchDashboardData(user.uid); // Fetch data THEN show content
            setupLogout();

        } else {
            // No user is signed in. Redirect to login.
            console.log('No user authenticated. Redirecting to login.');
             if(loader) loader.classList.add('hidden'); // Hide loader if shown
            // Ensure content remains hidden if somehow briefly shown
            if (dashboardContent) dashboardContent.classList.remove('visible');
            window.location.href = 'login_mobile.html'; // Redirect
        }
    }

    // --- Display User Info ---
    function displayUserInfo(user) {
        if (userInfoDiv && userEmailDisplay) {
            userEmailDisplay.textContent = user.email || 'User';
            userInfoDiv.style.display = 'flex';
        }
        const loginButton = document.getElementById('login-button');
        if(loginButton) loginButton.style.display = 'none';
    }

    // --- Fetch Dashboard Data (Placeholder - Requires Backend/DB Integration) ---
    async function fetchDashboardData(userId) {
        console.log(`Fetching dashboard data for user: ${userId}`);

        // --- Using MOCK DATA for Demonstration ---
        console.warn("Using Mock Data - Replace with actual Firebase fetch");
        try {
            await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
            const mockData = {
                clientName: "ACME Landscaping",
                caseStatus: "pending_review",
                caseStatusText: "Pending DOL Review",
                caseStatusUpdated: "2023-10-26",
                paymentStatus: "due",
                paymentDueAmount: "1500.00",
                lastPaymentDate: null,
                receiptUrl: "#",
                unreadMessages: 2,
                signatureRequired: true,
                signatureStatusText: "Employment agreement requires signature.",
            };
            populateDashboard(mockData);
            observeElements(); // Start observing for animations now that content is ready

        } catch (error) {
            console.error("Error during mock data fetch/processing:", error);
            displayErrorState("Error loading dashboard information.");
        } finally {
             if(loader) loader.classList.add('hidden'); // Hide loader
             // CRITICAL: Show the dashboard content area
             if (dashboardContent) {
                 dashboardContent.classList.add('visible');
                 console.log("Dashboard content set to visible.");
             } else {
                 console.error("Could not find dashboard content element to make visible!");
             }
        }
        // --- End Mock Data ---
    }

    // --- Populate Dashboard with Data ---
    function populateDashboard(data) {
        if (!data) {
            displayErrorState("No data available.");
            return;
        }
        console.log("Populating dashboard with data:", data);

        if (clientNameSpan) {
            clientNameSpan.textContent = data.clientName || 'Client';
            clientNameSpan.classList.remove('client-name-placeholder');
        }

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

        updatePaymentSection(data);

        if (messageBadge) {
            const count = data.unreadMessages || 0;
            messageBadge.textContent = count;
            messageBadge.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        if(signatureStatusText) signatureStatusText.textContent = data.signatureRequired ? (data.signatureStatusText || "Action required on documents.") : "No documents currently require action.";
        if (signatureBadge) signatureBadge.style.display = data.signatureRequired ? 'inline-flex' : 'none';
        const sigCard = document.querySelector('.signature-card');
        if (sigCard) sigCard.setAttribute('data-action-required', data.signatureRequired);


        setupActionListeners(data);
    }

    // --- Update Payment Section Logic ---
    function updatePaymentSection(data) {
         paymentLoadingDiv.style.display = 'none';
         paymentDueDiv.style.display = 'none';
         paymentPaidDiv.style.display = 'none';
         paymentErrorDiv.style.display = 'none';

         const status = data.paymentStatus;
         paymentSection.setAttribute('data-status', status || 'unknown'); // Set status on parent

         if (status === 'due' || status === 'overdue') {
             if (paymentDueAmount) paymentDueAmount.textContent = `$${parseFloat(data.paymentDueAmount || 0).toFixed(2)}`;
             paymentDueDiv.style.display = 'block';
         } else if (status === 'paid') {
             if (paymentDate) paymentDate.textContent = formatDate(data.lastPaymentDate) || '--/--/----';
             if (viewReceiptLink) viewReceiptLink.href = data.receiptUrl || '#';
             paymentPaidDiv.style.display = 'block';
         } else {
             console.log("Payment status unknown or needs specific handling:", status);
             // Show error or a neutral state? For now, error.
             paymentErrorDiv.style.display = 'block';
             paymentSection.setAttribute('data-status', 'error');
         }
    }

    // --- Setup Action Button Listeners ---
    function setupActionListeners(data) {
        // Simple example - replace alerts with actual navigation/modals
        const addClickListenerOnce = (element, handler) => {
            if (element && !element.hasAttribute('data-listener-set')) {
                element.addEventListener('click', handler);
                element.setAttribute('data-listener-set', 'true');
            }
        };

        addClickListenerOnce(makePaymentButton, () => {
            alert("Redirecting to payment processor..."); // Placeholder
        });

        addClickListenerOnce(viewReceiptLink, (e) => {
            e.preventDefault();
            if(data.receiptUrl && data.receiptUrl !== '#') window.open(data.receiptUrl, '_blank');
            else alert("Receipt URL not available.");
        });

        addClickListenerOnce(viewMessagesLink, (e) => {
            e.preventDefault(); alert("Navigating to Inbox..."); // Placeholder
        });

        addClickListenerOnce(signatureLink, (e) => {
            e.preventDefault(); alert("Navigating to Documents..."); // Placeholder
        });

        addClickListenerOnce(viewVideosLink, (e) => {
            e.preventDefault(); alert("Navigating to Video Library..."); // Placeholder
        });
    }

     // --- Setup Logout Button ---
     function setupLogout() {
         if (logoutButton && !logoutButton.hasAttribute('data-listener-set')) {
             logoutButton.addEventListener('click', (e) => {
                 e.preventDefault();
                 if (window.firebaseAuth && window.firebaseSignOut) {
                     window.firebaseSignOut(window.firebaseAuth).catch((error) => {
                         console.error("Sign out error:", error); alert("Logout failed.");
                     });
                     // Auth listener (handleAuthChange) will redirect on successful logout
                 }
             });
             logoutButton.setAttribute('data-listener-set', 'true');
         }
     }

    // --- Helper Functions ---
    function formatDate(dateString) { /* ... same as before ... */ }
    function displayErrorState(message) { /* ... same as before ... */ }

    // --- Intersection Observer Setup ---
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    const observerCallback = (entries, observer) => { /* ... same as before ... */ };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    function observeElements() { /* ... same as before ... */ }


    // --- Initialization ---
    let firebaseReady = false;
    document.addEventListener('firebaseReady', () => {
        firebaseReady = true;
        console.log("Firebase Ready event received (Dashboard). Setting up auth listener.");
        if (window.firebaseAuth && window.firebaseOnAuthStateChanged) {
            window.firebaseOnAuthStateChanged(window.firebaseAuth, handleAuthChange);
        } else {
             console.error("Firebase Auth functions not found on window after ready event.");
             displayErrorState("Initialization failed. Please refresh.");
             if(loader) loader.classList.add('hidden');
        }
    });

    document.addEventListener('firebaseError', () => {
        console.error("Firebase Error event received (Dashboard). Cannot proceed.");
        displayErrorState("Critical initialization error. Please contact support.");
        if(loader) loader.classList.add('hidden');
    });

     // Fallback check
     setTimeout(() => {
        if (!firebaseReady && !document.querySelector('.error-banner')) {
             console.error("Firebase did not initialize in time via event.");
             displayErrorState("Failed to initialize connection. Please check network and refresh.");
              if(loader) loader.classList.add('hidden');
              if (dashboardContent) dashboardContent.classList.add('visible'); // Show content to display error
         }
     }, 5000); // Increase timeout slightly


}); // End DOMContentLoaded