// js/getstarted_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const loader = document.getElementById('loader'); // Get loader

    // --- Form Elements ---
    const consultationForm = document.getElementById('consultation-request-form'); // Updated ID
    const consultationSection = document.getElementById('consultation-form-section'); // Updated ID
    const thankYouSection = document.getElementById('thank-you');

    // --- Body Fade-in & Loader ---
    // Use window.load to wait for all assets (like background image)
    window.addEventListener('load', () => {
        if (bodyElement) {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added (Consultation - Blue Theme).");
        } else {
            console.error("Body element not found. Fade-in cannot be applied (Consultation - Blue Theme).");
        }
        // Hide loader after a short delay
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                console.log("Loader hidden (Consultation - Blue Theme).");
            }, 150);
        } else {
             console.error("Loader element not found (Consultation - Blue Theme).");
        }
    });


    // --- Firebase Auth UI Handler ---
    function setupFirebaseAuthUiConsult() {
        // Check elements exist
        if (!loginButton || !userInfoDiv || !userEmailSpan || !logoutButton) {
            console.warn("Auth UI elements not all found on Consultation page.");
            // Set default state anyway
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            return;
        }

        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            const auth = window.firebaseAuth;
            console.log("Firebase auth object found, setting up listener (Consultation - Blue Theme).");

            window.firebaseOnAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is logged in (Consultation):", user.email);
                    loginButton.style.display = 'none';
                    userInfoDiv.style.display = 'flex';
                    userEmailSpan.textContent = user.email;
                } else {
                    console.log("User is logged out (Consultation).");
                    loginButton.style.display = 'inline-block'; // Use inline-block for button
                    userInfoDiv.style.display = 'none';
                    userEmailSpan.textContent = '';
                }
            });

            // Logout Listener (ensure it's only added once)
            if (!logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked (Consultation).");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful (Consultation).");
                        // UI updates via onAuthStateChanged
                    }).catch((error) => {
                        console.error("Firebase sign out failed (Consultation):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        } else {
            console.error("Essential Firebase Auth functions not found. UI fallback (Consultation).");
            // Default to logged-out state
            loginButton.style.display = 'inline-block';
            userInfoDiv.style.display = 'none';
        }
    }

    // Listen for Firebase ready/error events from HTML
    document.addEventListener('firebaseAuthReady', () => {
        console.log("Firebase Auth Ready event received. Setting up UI (Consultation).");
        setupFirebaseAuthUiConsult();
    });
    document.addEventListener('firebaseAuthError', () => {
        console.error("Firebase Auth Error event received. Setting up UI fallback (Consultation).");
        setupFirebaseAuthUiConsult(); // Attempt to set default state
    });
    // Initial check in case Firebase is already ready
    if (window.firebaseAuth) {
        console.log("Firebase Auth detected on DOMContentLoaded. Setting up UI (Consultation).");
        setupFirebaseAuthUiConsult();
    }


    // --- Form Submission Handler ---
    if (consultationForm && consultationSection && thankYouSection) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default page reload

            // Basic validation feedback (can be enhanced)
            if (!consultationForm.checkValidity()) {
                alert("Please fill out all required fields correctly.");
                // Optionally add visual cues to invalid fields
                consultationForm.reportValidity(); // Show browser's native validation messages
                return;
            }

            const formData = new FormData(consultationForm);
            const data = {
                fullName: formData.get('full-name'),
                companyName: formData.get('company-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                visaType: formData.get('visa-type'),
                workerCount: formData.get('worker-count'),
                message: formData.get('message'),
                submittedAt: new Date().toISOString() // Add timestamp
            };

            // --- Placeholder for actual submission ---
            // In a real application, you would send this data to a server/backend function
            // (e.g., Firebase Cloud Function, your own API endpoint) which would then:
            // 1. Store the data (e.g., in Firestore database: `firebase.firestore().collection('consultations').add(data);`)
            // 2. Trigger an email notification.
            // DO NOT send emails directly from client-side JavaScript for security reasons.

            console.log("--- Form Data Submitted (Simulated) ---");
            console.log("Data:", data);
            console.log("--> NEXT STEP: Send this data to backend for storage and email notification.");
            console.log("--> SIMULATING Email Trigger To: [Your designated email address]");
            console.log("---------------------------------------");

            // --- Show Thank You Message ---
            consultationSection.style.opacity = '0'; // Fade out form section
            consultationSection.style.display = 'none';

            thankYouSection.style.display = 'block'; // Make thank you section take up space
            setTimeout(() => { // Wait for display change, then fade in
                thankYouSection.style.opacity = '1'; // Fade in thank you message
                thankYouSection.classList.add('visible'); // Add class if needed for CSS transitions
                // Scroll to top smoothly (optional)
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50); // Short delay

        });
    } else {
        console.error("Consultation form or related sections not found.");
    }

    console.log("Get Started Desktop JS Initialized (Consultation - Blue Theme).");
}); // End DOMContentLoaded
