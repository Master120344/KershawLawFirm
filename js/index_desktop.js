// js/index_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;

    // --- Initial Setup ---
    // Add the 'loaded' class to trigger the CSS fade-in effect (opacity 0 to 1)
    // This is the FIX for the page appearing grey or blank on load.
    if (bodyElement) {
        // Add a very slight delay just in case rendering needs a moment,
        // though often not strictly necessary.
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50); // 50 milliseconds delay
    } else {
        console.error("Body element not found. Fade-in cannot be applied.");
    }

    // Check if Firebase Auth is available (initialized in HTML & exposed to window)
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        console.log("Firebase auth object found, setting up listener.");

        // --- Authentication State Listener ---
        // This runs immediately on load and whenever the auth state changes
        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log("User is logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex'; // Use 'flex' as per CSS
                if (userEmailSpan) userEmailSpan.textContent = user.email;

            } else {
                // User is signed out
                console.log("User is logged out.");
                if (loginButton) loginButton.style.display = 'inline-block'; // Or 'block'/'flex' depending on CSS
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        // --- Logout Button Listener ---
        // Make sure the listener is attached correctly
        if (logoutButton) {
             // Check if it already has a listener (prevent duplicates if script runs twice)
             if (!logoutButton.hasAttribute('data-listener-attached')) {
                 logoutButton.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default link behavior
                    console.log("Logout button clicked.");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful.");
                        // UI updates automatically via the onAuthStateChanged listener
                    }).catch((error) => {
                        console.error("Firebase sign out failed:", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true'); // Mark as attached
             }
        } else {
             // This is expected if the user is logged out, as the element might not exist in the DOM then.
             // console.log("Logout button element not found (likely hidden or user logged out).");
        }

    } else {
        console.error("Essential Firebase Auth functions (firebaseAuth, firebaseOnAuthStateChanged, firebaseSignOut) were not found on the window object. Ensure Firebase initializes correctly in the HTML *before* this script runs and that the functions are correctly assigned to 'window'.");
        // Fallback UI state if Firebase fails to load/initialize
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    console.log("Homepage JS Initialized.");

}); // End DOMContentLoaded