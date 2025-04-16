// Wait for the entire page (including images, CSS) to load
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bodyElement = document.body;

    // Ensure elements exist before manipulating
    if (bodyElement) {
        // Add 'loaded' class to trigger the body fade-in (defined in CSS)
        bodyElement.classList.add('loaded');
        console.log("Body 'loaded' class added for fade-in.");
    } else {
        console.error("Body element not found. Fade-in cannot be applied.");
    }

    if (loader) {
        // Wait a brief moment after body fade starts, then hide loader
        // Adjust timeout duration (e.g., 500ms) as needed for visual timing
        setTimeout(() => {
            loader.classList.add('hidden');
            console.log("Loader hidden.");
        }, 300); // 300ms delay before hiding loader
    } else {
        console.error("Loader element not found.");
    }
});


// Function to handle Firebase Auth UI updates
function setupFirebaseAuthUi() {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');

    // Check if Firebase Auth functions are available on the window object
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;
        console.log("Firebase auth object found, setting up listener.");

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                console.log("User is logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex'; // Use flex to align items
                if (userEmailSpan) userEmailSpan.textContent = user.email;
            } else {
                // User is logged out
                console.log("User is logged out.");
                if (loginButton) loginButton.style.display = 'inline-block'; // Or 'block'/'flex' depending on layout needs
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        // Setup logout button listener only once
        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                console.log("Logout button clicked.");
                window.firebaseSignOut(auth).then(() => {
                    console.log("Firebase sign out successful.");
                    // UI updates automatically via onAuthStateChanged listener
                }).catch((error) => {
                    console.error("Firebase sign out failed:", error);
                    alert("Logout failed. Please try again."); // Provide user feedback
                });
            });
            logoutButton.setAttribute('data-listener-attached', 'true'); // Mark as attached
        }
    } else {
        // Firebase Auth not ready or failed to initialize
        console.error("Essential Firebase Auth functions not found on window object. UI fallback.");
        // Ensure default state (logged out view) is shown
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }
}

// --- Firebase Initialization Handling ---
// Option 1: Listen for a custom event dispatched after Firebase initializes in HTML
document.addEventListener('firebaseAuthReady', () => {
    console.log("Firebase Auth Ready event received. Setting up UI.");
    setupFirebaseAuthUi();
});

// Option 2 (Fallback/Alternative): Check periodically if Firebase is ready
// Useful if the custom event approach isn't implemented or fails
let firebaseCheckInterval = null;
let checkAttempts = 0;

function checkFirebaseAuth() {
    checkAttempts++;
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        console.log("Firebase Auth detected via interval check. Setting up UI.");
        if (firebaseCheckInterval) clearInterval(firebaseCheckInterval);
        setupFirebaseAuthUi();
    } else if (checkAttempts > 20) { // Stop checking after ~5 seconds (20 * 250ms)
         console.error("Firebase Auth check timed out. Auth UI may not work.");
         if (firebaseCheckInterval) clearInterval(firebaseCheckInterval);
         // Ensure default state is shown if Firebase never loaded
         setupFirebaseAuthUi(); // Call it anyway to set the default state
    }
}

// Start checking only if the 'firebaseAuthReady' event wasn't received immediately
// (e.g., if this script runs before the inline Firebase script finishes)
if (!window.firebaseAuth) {
    firebaseCheckInterval = setInterval(checkFirebaseAuth, 250); // Check every 250ms
}

// Handle potential Firebase init error signaled from HTML
document.addEventListener('firebaseAuthError', () => {
     console.error("Firebase Auth Error event received. Auth UI may not work.");
     if (firebaseCheckInterval) clearInterval(firebaseCheckInterval); // Stop checking
     setupFirebaseAuthUi(); // Ensure default logged-out state is shown
});


console.log("Mobile Homepage JS Initialized."); // Changed console log slightly
