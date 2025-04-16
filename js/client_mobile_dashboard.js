document.addEventListener('DOMContentLoaded', () => {
    console.log('Client Dashboard Mobile JS Initialized.');

    // --- Essential DOM Element References ---
    const loader = document.getElementById('loader');
    const dashboardContent = document.querySelector('.dashboard-protected-content');
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
            // Show loader while fetching data
            if(loader) loader.classList.remove('hidden'); // Ensure loader is visible initially
            // Fetch dashboard data
            fetchDashboardData(user.uid);
            // Setup logout button listener
            setupLogout();

        } else {
            // No user is signed in. Redirect to login.
            console.log('No user authenticated. Redirecting to login.');
            // Hide loader immediately if it was visible
             if(loader) loader.classList.add('hidden');
            window.location.href = 'login_mobile.html'; // Or your login page filename
        }
    }

    // --- Display User Info ---
    function displayUserInfo(user) {
        if (userInfoDiv && userEmailDisplay) {
            userEmailDisplay.textContent = user.email || 'User';
            userInfoDiv.style.display = 'flex';
        }
         // Hide login button if it exists on this page (it shouldn't normally)
        const loginButton = document.getElementById('login-button');
        if(loginButton) loginButton.style.display = 'none';
    }

    // --- Fetch Dashboard Data (Placeholder - Requires Backend/DB Integration) ---
    async function fetchDashboardData(userId) {
        console.log(`Fetching dashboard data for user: ${userId}`);
        // --- THIS IS WHERE YOU'D INTERACT WITH FIREBASE FIRESTORE/REALTIME DB ---
        // Example using Firestore (requires Firestore setup in HTML script)
        /*
        if (window.firebaseDB && window.firebaseDoc && window.firebaseGetDoc) {
            try {
                const userDocRef = window.firebaseDoc(window.firebaseDB, "clientData", userId); // Adjust path
                const docSnap = await window.firebaseGetDoc(userDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("Client data:", data);
                    populateDashboard(data);
                } else {
                    console.log("No client data found for user!");
                    displayErrorState("Could not load dashboard data.");
                }
            } catch (error) {
                console.error("Error fetching client data:", error);
                displayErrorState("Error loading dashboard data.");
            } finally {
                // Hide loader once data is fetched or error occurs
                 if(loader) loader.classList.add('hidden');
                 // Show dashboard content after loading
                if (dashboardContent) {
                    dashboardContent.classList.add('visible');
                }
            }
        } else {
            console.error("Firestore functions not available on window.");
            displayErrorState("Internal error: Cannot load data.");
             if(loader) loader.classList.add('hidden');
             if (dashboardContent) {
                 dashboardContent.classList.add('visible'); // Show content even on error, but with error message
             }
        }
        */

        // --- Using MOCK DATA for Demonstration ---
        console.warn("Using Mock Data - Replace with actual Firebase fetch");
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
        const mockData = {
            clientName: "ACME Landscaping", // Fetch real name
            caseStatus: "pending_review", // e.g., 'submitted', 'pending_review', 'approved', 'action_required'
            caseStatusText: "Pending DOL Review",
            caseStatusUpdated: "2023-10-26", // Format this nicely
            paymentStatus: "due", // 'due', 'paid', 'overdue'
            paymentDueAmount: "1500.00",
            lastPaymentDate: null, // Or "2023-09-15" if paid
            receiptUrl: "#", // URL to receipt if paid
            unreadMessages: 2,
            signatureRequired: true,
            signatureStatusText: "Employment agreement requires signature.",
            // videoResources: [...] // Array of video links/info
        };
        populateDashboard(mockData);
         if(loader) loader.classList.add('hidden');
         if (dashboardContent) {
             dashboardContent.classList.add('visible');
         }
        // --- End Mock Data ---
    }

    // --- Populate Dashboard with Data ---
    function populateDashboard(data) {
        if (!data) {
            displayErrorState("No data available.");
            return;
        }

        // Welcome Message
        if (clientNameSpan) clientNameSpan.textContent = data.clientName || 'Client';
        if (clientNameSpan) clientNameSpan.classList.remove('client-name-placeholder');


        // Case Status
        if (caseStatusText) caseStatusText.textContent = data.caseStatusText || 'Unavailable';
        if (caseStatusUpdated) caseStatusUpdated.textContent = formatDate(data.caseStatusUpdated) || '--/--/----';
        if (caseStatusIndicator) {
            // Reset classes
            caseStatusIndicator.className = 'status-indicator';
            // Add specific class based on status
            switch (data.caseStatus) {
                case 'approved':
                    caseStatusIndicator.classList.add('status-good');
                    break;
                case 'action_required':
                case 'denied': // Example
                    caseStatusIndicator.classList.add('status-action');
                    break;
                case 'pending_review':
                case 'submitted': // Example
                    caseStatusIndicator.classList.add('status-pending');
                    break;
                default:
                    caseStatusIndicator.classList.add('status-info'); // Default/Unknown
            }
        }

        // Payment Section
        updatePaymentSection(data);


        // Inbox Badge
        if (messageBadge) {
            const count = data.unreadMessages || 0;
            if (count > 0) {
                messageBadge.textContent = count;
                messageBadge.style.display = 'inline-flex';
            } else {
                messageBadge.style.display = 'none';
            }
        }

        // Signature Section
        if(signatureStatusText) signatureStatusText.textContent = data.signatureStatusText || "No documents currently require action.";
        if (signatureBadge) {
             signatureBadge.style.display = data.signatureRequired ? 'inline-flex' : 'none';
        }
        if (signatureLink.parentElement.parentElement) { // Target the card
            signatureLink.parentElement.parentElement.setAttribute('data-action-required', data.signatureRequired);
        }


        // Add Event Listeners for Buttons/Links (if not already set)
        setupActionListeners(data); // Pass data in case URLs etc. are needed

    }

    // --- Update Payment Section Logic ---
    function updatePaymentSection(data) {
         // Hide all payment content initially
        paymentLoadingDiv.style.display = 'none';
        paymentDueDiv.style.display = 'none';
        paymentPaidDiv.style.display = 'none';
        paymentErrorDiv.style.display = 'none';

        if (data.paymentStatus === 'due' || data.paymentStatus === 'overdue') {
            if (paymentDueAmount) paymentDueAmount.textContent = `$${parseFloat(data.paymentDueAmount || 0).toFixed(2)}`;
            paymentDueDiv.style.display = 'block';
            paymentSection.setAttribute('data-status', 'due');
        } else if (data.paymentStatus === 'paid') {
            if (paymentDate) paymentDate.textContent = formatDate(data.lastPaymentDate) || '--/--/----';
            if (viewReceiptLink) viewReceiptLink.href = data.receiptUrl || '#'; // Set actual receipt URL
            paymentPaidDiv.style.display = 'block';
             paymentSection.setAttribute('data-status', 'paid');
        } else {
            // Handle other statuses or errors if necessary
             console.log("Unknown or non-standard payment status:", data.paymentStatus);
             // Show a generic message or the loading state again?
             // For now, let's assume 'paid' if not 'due' for simplicity in mock
             if (paymentDate) paymentDate.textContent = formatDate(data.lastPaymentDate) || '--/--/----';
             if (viewReceiptLink) viewReceiptLink.href = data.receiptUrl || '#';
             paymentPaidDiv.style.display = 'block';
             paymentSection.setAttribute('data-status', 'paid');
        }
    }

    // --- Setup Action Button Listeners ---
    function setupActionListeners(data) {
        // Ensure listeners are added only once
        if (makePaymentButton && !makePaymentButton.hasAttribute('data-listener-set')) {
            makePaymentButton.addEventListener('click', () => {
                console.log("Proceed to Payment clicked");
                // Redirect to payment gateway or show payment modal
                // Example: window.location.href = '/payment-page?amount=' + data.paymentDueAmount;
                alert("Redirecting to payment processor..."); // Placeholder
            });
            makePaymentButton.setAttribute('data-listener-set', 'true');
        }

        if (viewReceiptLink && !viewReceiptLink.hasAttribute('data-listener-set')) {
             viewReceiptLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default if it's just '#'
                console.log("View Receipt clicked");
                if(data.receiptUrl && data.receiptUrl !== '#') {
                    window.open(data.receiptUrl, '_blank'); // Open receipt in new tab
                } else {
                    alert("Receipt URL not available."); // Placeholder
                }
            });
            viewReceiptLink.setAttribute('data-listener-set', 'true');
        }


        if (viewMessagesLink && !viewMessagesLink.hasAttribute('data-listener-set')) {
            viewMessagesLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Open Inbox clicked");
                // Navigate to a dedicated inbox page
                // Example: window.location.href = 'inbox_mobile.html';
                alert("Navigating to Inbox..."); // Placeholder
            });
            viewMessagesLink.setAttribute('data-listener-set', 'true');
        }

        if (signatureLink && !signatureLink.hasAttribute('data-listener-set')) {
             signatureLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Review Documents clicked");
                // Navigate to document signing area
                // Example: window.location.href = 'documents_mobile.html';
                 alert("Navigating to Documents..."); // Placeholder
            });
             signatureLink.setAttribute('data-listener-set', 'true');
        }

         if (viewVideosLink && !viewVideosLink.hasAttribute('data-listener-set')) {
             viewVideosLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("View Videos clicked");
                // Navigate to video library page
                // Example: window.location.href = 'videos_mobile.html';
                 alert("Navigating to Video Library..."); // Placeholder
            });
             viewVideosLink.setAttribute('data-listener-set', 'true');
        }
    }

     // --- Setup Logout Button ---
     function setupLogout() {
         if (logoutButton && !logoutButton.hasAttribute('data-listener-set')) {
             logoutButton.addEventListener('click', (e) => {
                 e.preventDefault();
                 if (window.firebaseAuth && window.firebaseSignOut) {
                     window.firebaseSignOut(window.firebaseAuth).then(() => {
                         console.log("User signed out successfully.");
                         // Auth listener will handle redirect
                     }).catch((error) => {
                         console.error("Sign out error:", error);
                         alert("Logout failed. Please try again.");
                     });
                 }
             });
             logoutButton.setAttribute('data-listener-set', 'true');
         }
     }

    // --- Helper Functions ---
    function formatDate(dateString) {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            // Adjust for potential timezone issues if dateString is just YYYY-MM-DD
            const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            return adjustedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString; // Return original if formatting fails
        }
    }

    function displayErrorState(message) {
        // Could display a general error message on the dashboard
        console.error("Dashboard Error:", message);
        // Example: Show an error banner
        const errorBanner = document.createElement('div');
        errorBanner.className = 'error-banner';
        errorBanner.textContent = message;
        dashboardContent.prepend(errorBanner); // Add to top of dashboard

         // Hide specific loading states, show error in payment section
        paymentLoadingDiv.style.display = 'none';
        paymentDueDiv.style.display = 'none';
        paymentPaidDiv.style.display = 'none';
        paymentErrorDiv.style.display = 'block';
        paymentSection.setAttribute('data-status', 'error');
    }


    // --- Initialization ---
    // Wait for Firebase to be ready using the custom event from HTML
    document.addEventListener('firebaseReady', () => {
        console.log("Firebase Ready event received (Dashboard). Setting up auth listener.");
        if (window.firebaseAuth && window.firebaseOnAuthStateChanged) {
            window.firebaseOnAuthStateChanged(window.firebaseAuth, handleAuthChange);
        } else {
             console.error("Firebase Auth functions not found on window after ready event.");
             displayErrorState("Initialization failed. Please refresh.");
             if(loader) loader.classList.add('hidden');
        }
    });

    // Handle potential Firebase initialization errors
    document.addEventListener('firebaseError', () => {
        console.error("Firebase Error event received (Dashboard). Cannot proceed.");
        displayErrorState("Critical initialization error. Please contact support.");
        if(loader) loader.classList.add('hidden');
        // Optionally redirect or show a persistent error message
    });

     // Fallback check - If Firebase isn't ready after a short delay, show error
     setTimeout(() => {
        if (!window.firebaseAuth && !document.querySelector('.error-banner')) { // Check if error already shown
             console.error("Firebase did not initialize in time.");
             displayErrorState("Failed to initialize. Please check your connection and refresh.");
              if(loader) loader.classList.add('hidden');
              if (dashboardContent) { // Make content area visible to show error
                 dashboardContent.classList.add('visible');
             }
         }
     }, 4000); // Wait 4 seconds for Firebase


    // --- Intersection Observer for Animations (Copied from services_mobile) ---
    const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    // Observe elements *after* auth check potentially makes content visible
    function observeElements() {
        const elementsToAnimate = document.querySelectorAll('.dashboard-protected-content [data-animation]');
        if (elementsToAnimate.length > 0) {
             console.log(`Observing ${elementsToAnimate.length} dashboard elements.`);
             elementsToAnimate.forEach(el => scrollObserver.observe(el));
        }
    }
    // Call observeElements after data is fetched and dashboard is visible
    // (Integrated into fetchDashboardData final step)


    // --- Footer Year (If footer is used) ---
    // const footerYearSpan = document.getElementById('current-year');
    // if (footerYearSpan) {
    //     footerYearSpan.textContent = new Date().getFullYear();
    // }

}); // End DOMContentLoaded