// js/login_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;

    // Fade-in Effect
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found.");
    }

    // Firebase Auth Setup
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut && window.firebaseSignInWithEmailAndPassword) {
        const auth = window.firebaseAuth;

        // Auth State Listener
        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.email);
                if (loginForm) loginForm.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = user.email;
                if (loginMessage) loginMessage.textContent = '';
                // Redirect to index2_desktop.html after login
                window.location.href = '/KershawLawFirm/index2_desktop.html';
            } else {
                console.log("User logged out.");
                if (loginForm) loginForm.style.display = 'block';
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        // Login Form Submission
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                window.firebaseSignInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        console.log("Login successful:", userCredential.user.email);
                        loginMessage.textContent = "Login successful! Redirecting...";
                        loginMessage.classList.remove('error');
                        loginMessage.classList.add('success');
                        // The redirect will happen via onAuthStateChanged
                    })
                    .catch((error) => {
                        console.error("Login failed:", error.message);
                        loginMessage.textContent = `Error: ${error.message}`;
                        loginMessage.classList.remove('success');
                        loginMessage.classList.add('error');
                    });
            });
        }

        // Logout Handler
        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Logout clicked.");
                window.firebaseSignOut(auth)
                    .then(() => {
                        console.log("Sign out successful.");
                    })
                    .catch((error) => {
                        console.error("Logout failed:", error);
                        alert("Logout failed. Please try again.");
                    });
            });
            logoutButton.setAttribute('data-listener-attached', 'true');
        }
    } else {
        console.error("Firebase Auth not initialized properly.");
        if (loginForm) loginForm.style.display = 'block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    console.log("Login Desktop JS Initialized.");
});
