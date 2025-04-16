document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Mobile JS Initialized.');

    // --- Add 'loaded' class for initial fade-in ---
    const bodyElement = document.body;
    if (bodyElement) {
        // Delay slightly to ensure CSS is fully parsed, prevents flash
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50); // Small delay
    } else {
        console.error("Body element not found. Fade-in cannot be applied.");
    }

    // --- Hide Loader (after a delay allowing fade-in to start) ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            console.log("Loader hidden.");
        }, 350); // Adjust timing as needed (e.g., 300-500ms)
    } else {
        console.warn("Loader element not found.");
    }

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px 0px -12% 0px', // Trigger when element is 12% from bottom
        threshold: 0.1  // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToAnimate = document.querySelectorAll('[data-animation]');

    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
        console.log(`Observing ${elementsToAnimate.length} elements for scroll animation.`);
    } else {
        console.warn("No elements found for scroll animation ([data-animation]).");
    }

    // --- Footer Year Update ---
    const footerYearSpan = document.getElementById('current-year');
    if (footerYearSpan) {
        footerYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Footer year span (#current-year) not found.");
    }

     // --- Firebase Auth UI Handling (Crucial - Requires Firebase Init in HTML) ---
    function setupFirebaseAuthUiMobile() {
        const loginButton = document.getElementById('login-button');
        const userInfoDiv = document.getElementById('user-info');
        const userEmailSpan = document.getElementById('user-email');
        const logoutButton = document.getElementById('logout-button');

        // Check if Firebase Auth functions are globally available
        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            const auth = window.firebaseAuth;
            console.log("Firebase auth object found, setting up mobile UI listener.");

            window.firebaseOnAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in
                    console.log("User logged in (Mobile Services):", user.email);
                    if (loginButton) loginButton.style.display = 'none';
                    if (userInfoDiv) userInfoDiv.style.display = 'flex';
                    if (userEmailSpan) userEmailSpan.textContent = user.email;
                } else {
                    // User is signed out
                    console.log("User logged out (Mobile Services).");
                    if (loginButton) loginButton.style.display = 'inline-block';
                    if (userInfoDiv) userInfoDiv.style.display = 'none';
                    if (userEmailSpan) userEmailSpan.textContent = '';
                }
            });

            // Logout Button Listener
            if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked (Mobile Services).");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful (Mobile Services).");
                        // UI updates via onAuthStateChanged
                    }).catch((error) => {
                        console.error("Firebase sign out failed (Mobile Services):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        } else {
            console.error("Firebase Auth functions not found on window. UI fallback needed.");
            // Ensure logged-out view is default if Firebase fails
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
        }
    }

    // --- Wait for Firebase to be Ready ---
    // Listen for the custom event dispatched from the HTML's Firebase init script
    document.addEventListener('firebaseAuthReady', () => {
        console.log("Firebase Auth Ready event received (Mobile Services). Setting up UI.");
        setupFirebaseAuthUiMobile();
    });

    // Fallback check in case the event listener doesn't fire (e.g., script order issues)
    let firebaseCheckIntervalMobile = null;
    let checkAttemptsMobile = 0;
    function checkFirebaseAuthMobile() {
        checkAttemptsMobile++;
        if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
            console.log("Firebase Auth detected via interval check (Mobile Services). Setting up UI.");
            if (firebaseCheckIntervalMobile) clearInterval(firebaseCheckIntervalMobile);
            setupFirebaseAuthUiMobile();
        } else if (checkAttemptsMobile > 20) { // Stop after ~5 seconds
            console.error("Firebase Auth check timed out (Mobile Services). Auth UI might not function correctly.");
            if (firebaseCheckIntervalMobile) clearInterval(firebaseCheckIntervalMobile);
            setupFirebaseAuthUiMobile(); // Attempt setup anyway to show default state
        }
    }
    // Start checking only if Firebase isn't ready immediately
    if (!window.firebaseAuth) {
        firebaseCheckIntervalMobile = setInterval(checkFirebaseAuthMobile, 250);
    }

     // Handle potential Firebase initialization errors signaled from HTML
     document.addEventListener('firebaseAuthError', () => {
         console.error("Firebase Auth Error event received (Mobile Services). Auth UI fallback.");
         if (firebaseCheckIntervalMobile) clearInterval(firebaseCheckIntervalMobile); // Stop checking
         setupFirebaseAuthUiMobile(); // Ensure default logged-out state is shown
     });

}); // End DOMContentLoaded