// js/getstarted_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const loader = document.getElementById('loader');

    const consultationForm = document.getElementById('consultation-request-form');
    const consultationSection = document.getElementById('consultation-form-section');
    const thankYouSection = document.getElementById('thank-you');

    // --- Body Fade-in & Loader ---
    window.addEventListener('load', () => {
        if (bodyElement) {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added (Consultation - Polished Theme).");
        } else {
            console.error("Body element not found (Consultation - Polished Theme).");
        }
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                console.log("Loader hidden (Consultation - Polished Theme).");
            }, 150);
        } else {
             console.error("Loader element not found (Consultation - Polished Theme).");
        }
    });

    // --- Firebase Auth UI Handler ---
    function setupFirebaseAuthUiConsult() {
        if (!loginButton || !userInfoDiv || !userEmailSpan || !logoutButton) {
            console.warn("Auth UI elements not all found on Consultation page (Polished).");
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            return;
        }
        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            const auth = window.firebaseAuth;
            console.log("Firebase auth object found, setting up listener (Consultation - Polished Theme).");
            window.firebaseOnAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is logged in (Consultation - Polished):", user.email);
                    loginButton.style.display = 'none';
                    userInfoDiv.style.display = 'flex';
                    userEmailSpan.textContent = user.email;
                } else {
                    console.log("User is logged out (Consultation - Polished).");
                    loginButton.style.display = 'inline-block';
                    userInfoDiv.style.display = 'none';
                    userEmailSpan.textContent = '';
                }
            });
            if (!logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked (Consultation - Polished).");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful (Consultation - Polished).");
                    }).catch((error) => {
                        console.error("Firebase sign out failed (Consultation - Polished):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        } else {
            console.error("Essential Firebase Auth functions not found. UI fallback (Consultation - Polished).");
            loginButton.style.display = 'inline-block';
            userInfoDiv.style.display = 'none';
        }
    }
    document.addEventListener('firebaseAuthReady', () => {
        console.log("Firebase Auth Ready event received. Setting up UI (Consultation - Polished).");
        setupFirebaseAuthUiConsult();
    });
    document.addEventListener('firebaseAuthError', () => {
        console.error("Firebase Auth Error event received. Setting up UI fallback (Consultation - Polished).");
        setupFirebaseAuthUiConsult();
    });
    if (window.firebaseAuth) {
        console.log("Firebase Auth detected on DOMContentLoaded. Setting up UI (Consultation - Polished).");
        setupFirebaseAuthUiConsult();
    }

    // --- Form Submission Handler ---
    if (consultationForm && consultationSection && thankYouSection) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!consultationForm.checkValidity()) {
                // alert("Please fill out all required fields correctly."); // Basic alert
                consultationForm.reportValidity(); // Show native browser validation hints
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
                submittedAt: new Date().toISOString()
            };

            // --- Simulation Placeholder ---
            console.log("--- Form Data Submitted (Simulated) ---");
            console.log("Data:", data);
            console.log("--> NEXT STEP: Send data to backend (e.g., Firebase Function) for storage & email.");
            console.log("---------------------------------------");

            // --- Show Thank You ---
            consultationSection.style.transition = 'opacity 0.4s ease-out'; // Add transition for fade-out
            consultationSection.style.opacity = '0';

            setTimeout(() => { // Wait for fade out before hiding
                 consultationSection.style.display = 'none';
                 thankYouSection.style.display = 'block';
                 // Force reflow before adding opacity class for transition
                 void thankYouSection.offsetWidth;
                 thankYouSection.style.opacity = '1';
                 thankYouSection.classList.add('visible');
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 400); // Match transition duration

        });
    } else {
        console.error("Consultation form or related sections not found.");
    }

    console.log("Get Started Desktop JS Initialized (Consultation - Polished Theme).");
}); // End DOMContentLoaded
