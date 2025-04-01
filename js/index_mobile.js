// js/index_mobile.js
// ** The content here is IDENTICAL to the corrected js/index_desktop.js **

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;

    // --- Initial Setup ---
    // Add the 'loaded' class to trigger the CSS fade-in effect (opacity 0 to 1)
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in (Mobile).");
        }, 50);
    } else {
        console.error("Body element not found (Mobile). Fade-in cannot be applied.");
    }

    // Check if Firebase Auth is available (initialized in HTML & exposed to window)
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        console.log("Firebase auth object found, setting up listener (Mobile).");

        // --- Authentication State Listener ---
        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log("User is logged in (Mobile):", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = user.email;

            } else {
                // User is signed out
                console.log("User is logged out (Mobile).");
                if (loginButton) loginButton.style.display = 'inline-block';
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        // --- Logout Button Listener ---
        if (logoutButton) {
             if (!logoutButton.hasAttribute('data-listener-attached')) {
                 logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked (Mobile).");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful (Mobile).");
                    }).catch((error) => {
                        console.error("Firebase sign out failed (Mobile):", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
             }
        } else {
            // console.log("Logout button element not found (Mobile - likely hidden or user logged out).");
        }

    } else {
        console.error("Essential Firebase Auth functions not found on window object (Mobile). Check HTML script order and initialization.");
        // Fallback UI state
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    console.log("Homepage Mobile JS Initialized.");

}); // End DOMContentLoaded