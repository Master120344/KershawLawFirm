document.addEventListener('DOMContentLoaded', () => {
    console.log("Services Desktop JS Initialized (Bordered Content Theme).");

    // --- Loader Hiding ---
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                console.log("Loader hidden (Services - Bordered Content Theme).");
            }, 150);
        } else {
            console.error("Loader element not found (Services - Bordered Content Theme).");
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
        console.log(`Scroll animation observer set up for ${animatedElements.length} elements (Services - Bordered Content Theme).`);
    } else {
        console.log("No elements found for scroll animation (Services - Bordered Content Theme).");
    }


    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
        console.log("Current year set in footer (Services - Bordered Content Theme).");
    } else {
        console.warn("Current year span not found in footer (Services - Bordered Content Theme).");
    }

    // --- Firebase Auth UI Setup ---
    function setupFirebaseAuthUiServices() {
        const loginButton = document.getElementById('login-button');
        const userInfoDiv = document.getElementById('user-info');
        const userEmailSpan = document.getElementById('user-email');
        const logoutButton = document.getElementById('logout-button');

        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            const auth = window.firebaseAuth;
            console.log("Firebase auth object found, setting up listener (Services - Bordered Content Theme).");

            window.firebaseOnAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is logged in (Services - Bordered Content Theme):", user.email);
                    if (loginButton) loginButton.style.display = 'none';
                    if (userInfoDiv) userInfoDiv.style.display = 'flex';
                    if (userEmailSpan) userEmailSpan.textContent = user.email;
                } else {
                    console.log("User is logged out (Services - Bordered Content Theme).");
                    if (loginButton) loginButton.style.display = 'inline-block';
                    if (userInfoDiv) userInfoDiv.style.display = 'none';
                    if (userEmailSpan) userEmailSpan.textContent = '';
                }
            });

            if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked (Services - Bordered Content Theme).");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful (Services - Bordered Content Theme).");
                    }).catch((error) => {
                        console.error("Firebase sign out failed (Services - Bordered Content Theme):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        } else {
            console.error("Essential Firebase Auth functions not found on window object. UI fallback (Services - Bordered Content Theme).");
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
        }
    }

    document.addEventListener('firebaseAuthReady', () => {
        console.log("Firebase Auth Ready event received. Setting up UI (Services - Bordered Content Theme).");
        setupFirebaseAuthUiServices();
    });

    if (window.firebaseAuth) {
         console.log("Firebase Auth detected on load. Setting up UI (Services - Bordered Content Theme).");
         setupFirebaseAuthUiServices();
    }

    document.addEventListener('firebaseAuthError', () => {
         console.error("Firebase Auth Error event received. Auth UI may not work (Services - Bordered Content Theme).");
         setupFirebaseAuthUiServices();
    });

}); // End DOMContentLoaded
