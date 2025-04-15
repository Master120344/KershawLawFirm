// js/index_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;

    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found. Fade-in cannot be applied.");
    }

    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        console.log("Firebase auth object found, setting up listener.");

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) {
                    userInfoDiv.style.display = 'flex';
                    console.log("User info UI displayed with email:", user.email);
                }
                if (userEmailSpan) userEmailSpan.textContent = user.email;
            } else {
                console.log("User is logged out.");
                if (loginButton) loginButton.style.display = 'inline-block';
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        if (logoutButton) {
            if (!logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked.");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful.");
                    }).catch((error) => {
                        console.error("Firebase sign out failed:", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        }
    } else {
        console.error("Essential Firebase Auth functions not found on window object. Ensure Firebase initializes correctly in the HTML before this script runs.");
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    console.log("Homepage JS Initialized.");
});
