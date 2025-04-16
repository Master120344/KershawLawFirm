// Wait for the entire page (including images, CSS) to load
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const bodyElement = document.body;

    // Ensure elements exist before manipulating
    if (bodyElement) {
        // Add 'loaded' class to trigger the body fade-in (defined in CSS)
        bodyElement.classList.add('loaded');
        console.log("Body 'loaded' class added for fade-in (Desktop).");
    } else {
        console.error("Body element not found. Fade-in cannot be applied (Desktop).");
    }

    if (loader) {
        // Wait a brief moment after body fade starts, then hide loader
        setTimeout(() => {
            loader.classList.add('hidden');
            console.log("Loader hidden (Desktop).");
        }, 300); // Keep delay consistent or adjust if needed
    } else {
        console.error("Loader element not found (Desktop).");
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
        console.log("Firebase auth object found, setting up listener (Desktop).");

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                console.log("User is logged in (Desktop):", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex'; // Use flex for horizontal layout
                if (userEmailSpan) userEmailSpan.textContent = user.email;
            } else {
                // User is logged out
                console.log("User is logged out (Desktop).");
                if (loginButton) loginButton.style.display = 'inline-block'; // Or 'flex'
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        // Setup logout button listener only once
        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                console.log("Logout button clicked (Desktop).");
                window.firebaseSignOut(auth).then(() => {
                    console.log("Firebase sign out successful (Desktop).");
                    // UI updates automatically via onAuthStateChanged listener
                }).catch((error) => {
                    console.error("Firebase sign out failed (Desktop):", error);
                    alert("Logout failed. Please try again."); // User feedback
                });
            });
            logoutButton.setAttribute('data-listener-attached', 'true'); // Mark as attached
        }
    } else {
        // Firebase Auth not ready or failed to initialize
        console.error("Essential Firebase Auth functions not found on window object. UI fallback (Desktop).");
        // Ensure default state (logged out view) is shown
        if (loginButton) loginButton.style.display = 'inline-block'; // Or 'flex'
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }
}

// --- Firebase Initialization Handling ---
document.addEventListener('firebaseAuthReady', () => {
    console.log("Firebase Auth Ready event received. Setting up UI (Desktop).");
    setupFirebaseAuthUi();
});

let firebaseCheckInterval = null;
let checkAttempts = 0;

function checkFirebaseAuth() {
    checkAttempts++;
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        console.log("Firebase Auth detected via interval check. Setting up UI (Desktop).");
        if (firebaseCheckInterval) clearInterval(firebaseCheckInterval);
        setupFirebaseAuthUi();
    } else if (checkAttempts > 20) { // Stop checking after ~5 seconds
         console.error("Firebase Auth check timed out. Auth UI may not work (Desktop).");
         if (firebaseCheckInterval) clearInterval(firebaseCheckInterval);
         setupFirebaseAuthUi(); // Call it anyway to set the default state
    }
}

if (!window.firebaseAuth) {
    firebaseCheckInterval = setInterval(checkFirebaseAuth, 250);
}

document.addEventListener('firebaseAuthError', () => {
     console.error("Firebase Auth Error event received. Auth UI may not work (Desktop).");
     if (firebaseCheckInterval) clearInterval(firebaseCheckInterval); // Stop checking
     setupFirebaseAuthUi(); // Ensure default logged-out state
});


console.log("Desktop Homepage JS Initialized."); // Updated console log
