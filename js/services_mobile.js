/* ==========================================================================
   SERVICES MOBILE JS (Bordered Content Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Updated log for Mobile context
    console.log("Services Mobile JS Initialized (Bordered Content Theme).");

    // --- Loader Hiding ---
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                // Updated log for Mobile context
                console.log("Loader hidden (Services Mobile).");
            }, 150);
        } else {
            // Updated log for Mobile context
            console.error("Loader element not found (Services Mobile).");
        }
    });

    // --- Scroll Animation ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        };
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => { observer.observe(el); });
        // Updated log for Mobile context
        console.log(`Scroll animation observer set up for ${animatedElements.length} elements (Services Mobile).`);
    } else {
         // Updated log for Mobile context
        console.log("No elements found for scroll animation (Services Mobile).");
    }

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
         // Updated log for Mobile context
        console.log("Current year set in footer (Services Mobile).");
    } else {
         // Updated log for Mobile context
        console.warn("Current year span not found in footer (Services Mobile).");
    }

    // --- Firebase Auth UI Setup ---
    function setupFirebaseAuthUiServicesMobile() { // Renamed function slightly for clarity
        const loginButton = document.getElementById('login-button');
        const userInfoDiv = document.getElementById('user-info');
        const userEmailSpan = document.getElementById('user-email');
        const logoutButton = document.getElementById('logout-button');

        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            const auth = window.firebaseAuth;
             // Updated log for Mobile context
            console.log("Firebase auth object found, setting up listener (Services Mobile).");

            window.firebaseOnAuthStateChanged(auth, (user) => {
                if (user) {
                    // Updated log for Mobile context
                    console.log("User is logged in (Services Mobile):", user.email);
                    if (loginButton) loginButton.style.display = 'none';
                    if (userInfoDiv) userInfoDiv.style.display = 'flex';
                    if (userEmailSpan) userEmailSpan.textContent = user.email;
                } else {
                    // Updated log for Mobile context
                    console.log("User is logged out (Services Mobile).");
                    if (loginButton) loginButton.style.display = 'inline-block'; // or 'flex' depending on mobile styles
                    if (userInfoDiv) userInfoDiv.style.display = 'none';
                    if (userEmailSpan) userEmailSpan.textContent = '';
                }
            });

            if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                     // Updated log for Mobile context
                    console.log("Logout button clicked (Services Mobile).");
                    window.firebaseSignOut(auth).then(() => {
                         // Updated log for Mobile context
                        console.log("Firebase sign out successful (Services Mobile).");
                    }).catch((error) => {
                         // Updated log for Mobile context
                        console.error("Firebase sign out failed (Services Mobile):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        } else {
            // Updated log for Mobile context
            console.error("Essential Firebase Auth functions not found. UI fallback (Services Mobile).");
            if (loginButton) loginButton.style.display = 'inline-block'; // or 'flex'
            if (userInfoDiv) userInfoDiv.style.display = 'none';
        }
    }

    document.addEventListener('firebaseAuthReady', () => {
         // Updated log for Mobile context
        console.log("Firebase Auth Ready event received. Setting up UI (Services Mobile).");
        setupFirebaseAuthUiServicesMobile();
    });

    if (window.firebaseAuth) {
         // Updated log for Mobile context
         console.log("Firebase Auth detected on load. Setting up UI (Services Mobile).");
         setupFirebaseAuthUiServicesMobile();
    }

    document.addEventListener('firebaseAuthError', () => {
         // Updated log for Mobile context
         console.error("Firebase Auth Error event received. Auth UI may not work (Services Mobile).");
         setupFirebaseAuthUiServicesMobile(); // Ensure default state
    });

}); // End DOMContentLoaded