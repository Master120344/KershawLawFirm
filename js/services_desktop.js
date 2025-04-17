/* ==========================================================================
   SERVICES DESKTOP JS (Clear Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Services Desktop JS Initialized (Clear Theme).");

    // --- Loader Hiding ---
    // Uses 'load' event to ensure all assets are loaded
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => { // Short delay before hiding
                loader.classList.add('hidden');
                console.log("Loader hidden (Services - Clear Theme).");
            }, 150); // Adjust delay as needed
        } else {
            console.error("Loader element not found (Services - Clear Theme).");
        }
    });

    // --- Scroll Animation ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // Check if element is intersecting (visible)
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Stop observing once animated to save resources
                    observer.unobserve(entry.target);
                     // Console log for debugging animation trigger
                    // console.log(`Element animated and unobserved:`, entry.target);
                }
            });
        };

        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
             // Console log for debugging elements being observed
            // console.log(`Observing element:`, el);
        });
         console.log(`Scroll animation observer set up for ${animatedElements.length} elements (Services - Clear Theme).`);
    } else {
        console.log("No elements found for scroll animation (Services - Clear Theme).");
    }


    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
        console.log("Current year set in footer (Services - Clear Theme).");
    } else {
        console.warn("Current year span not found in footer (Services - Clear Theme).");
    }

    // --- Firebase Auth UI Setup (Triggered by events from HTML script) ---
    function setupFirebaseAuthUiServices() {
        const loginButton = document.getElementById('login-button');
        const userInfoDiv = document.getElementById('user-info');
        const userEmailSpan = document.getElementById('user-email');
        const logoutButton = document.getElementById('logout-button');

        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            const auth = window.firebaseAuth;
            console.log("Firebase auth object found, setting up listener (Services - Clear Theme).");

            window.firebaseOnAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is logged in (Services - Clear Theme):", user.email);
                    if (loginButton) loginButton.style.display = 'none';
                    if (userInfoDiv) userInfoDiv.style.display = 'flex';
                    if (userEmailSpan) userEmailSpan.textContent = user.email;
                } else {
                    console.log("User is logged out (Services - Clear Theme).");
                    if (loginButton) loginButton.style.display = 'inline-block'; // Or 'flex'
                    if (userInfoDiv) userInfoDiv.style.display = 'none';
                    if (userEmailSpan) userEmailSpan.textContent = '';
                }
            });

            // Setup logout button listener
            if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked (Services - Clear Theme).");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful (Services - Clear Theme).");
                    }).catch((error) => {
                        console.error("Firebase sign out failed (Services - Clear Theme):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        } else {
            console.error("Essential Firebase Auth functions not found on window object. UI fallback (Services - Clear Theme).");
             // Ensure default state (logged out view) is shown
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
        }
    }

    // Listen for Firebase ready event from HTML
    document.addEventListener('firebaseAuthReady', () => {
        console.log("Firebase Auth Ready event received. Setting up UI (Services - Clear Theme).");
        setupFirebaseAuthUiServices();
    });

     // Fallback check in case the event fires before this script runs
    if (window.firebaseAuth) {
         console.log("Firebase Auth detected on load. Setting up UI (Services - Clear Theme).");
         setupFirebaseAuthUiServices();
    }

    document.addEventListener('firebaseAuthError', () => {
         console.error("Firebase Auth Error event received. Auth UI may not work (Services - Clear Theme).");
         setupFirebaseAuthUiServices(); // Ensure default logged-out state
    });

}); // End DOMContentLoaded
