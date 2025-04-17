// js/login_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginSection = document.getElementById('login-section');
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginSubmitButton = document.getElementById('login-submit-button');
    const loginMessage = document.getElementById('login-message');

    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const resetPasswordSection = document.getElementById('reset-password-section');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetEmailInput = document.getElementById('reset-email');
    const resetSubmitButton = document.getElementById('reset-submit-button');
    const resetMessage = document.getElementById('reset-message');
    const cancelResetButton = document.getElementById('cancel-reset-button');

    const loader = document.getElementById('loader');
    const initErrorMessage = document.getElementById('init-error-message');

    // --- Helper Functions ---
    const showLoader = () => { console.log("Showing loader"); if (loader) loader.style.display = 'block'; };
    const hideLoader = () => { console.log("Hiding loader"); if (loader) loader.style.display = 'none'; };

    const showMessage = (element, message, isError = false) => {
        if (!element) return;
        console.log(`Displaying message (${isError ? 'Error' : 'Success'}): ${message}`);
        element.textContent = message;
        element.className = `message ${isError ? 'error' : 'success'} visible`;
        setTimeout(() => clearMessage(element), 5000);
    };

    const clearMessage = (element) => {
        if (!element) return;
        element.textContent = '';
        element.className = 'message';
    };

    const disableButton = (button) => { if (button) button.disabled = true; };
    const enableButton = (button) => { if (button) button.disabled = false; };


    // --- Firebase Readiness Check ---
    let auth; // Firebase auth instance

    document.addEventListener('firebaseReady', () => {
        console.log("Event: firebaseReady received.");
        if (window.firebaseAuth) {
            auth = window.firebaseAuth;
            console.log("Auth service assigned locally.");

            if (window.onAuthStateChanged) {
                console.log("Setting up onAuthStateChanged listener.");
                window.onAuthStateChanged(auth, (user) => {
                    // This runs initially AND when login/logout happens
                    if (user) {
                        console.log("onAuthStateChanged: User IS logged in:", user.email, "Redirecting...");
                         // Ensure loader is hidden before redirect attempt
                        hideLoader();
                        // Ensure forms remain hidden during redirect
                        if(loginSection) loginSection.style.display = 'none';
                        if(resetPasswordSection) resetPasswordSection.style.display = 'none';
                        window.location.href = 'client_dashboard_desktop.html';
                    } else {
                        console.log("onAuthStateChanged: No user logged in. Ensuring login form is visible.");
                        // Only show login form if Firebase init didn't fail
                        if (!initErrorMessage || initErrorMessage.style.display === 'none') {
                            if (loginSection && resetPasswordSection) {
                                loginSection.style.display = 'block'; // << SHOW LOGIN FORM HERE
                                resetPasswordSection.style.display = 'none';
                                console.log("Login form displayed.");
                            } else {
                                console.error("Login or Reset section element missing!");
                            }
                        } else {
                            console.log("Init error message is visible, not showing login form.");
                        }
                        hideLoader(); // Hide loader after check completes
                    }
                }, (error) => {
                    // This error handler is for the listener itself, less common
                    console.error("Error within onAuthStateChanged listener:", error);
                    showMessage(loginMessage, 'Error checking login status. Please refresh.', true);
                    if(loginSection) loginSection.style.display = 'block'; // Try to show login form
                    hideLoader();
                });
            } else {
                 console.error("onAuthStateChanged function not found on window.");
                 showMessage(loginMessage, 'Critical auth function missing.', true);
                 if(loginSection) loginSection.style.display = 'block'; // Try to show login form
                 hideLoader();
            }
        } else {
            console.error("Firebase Auth object not found on window after firebaseReady event.");
            showMessage(loginMessage, 'Authentication service failed to load correctly.', true);
            hideLoader();
        }
    });

    document.addEventListener('firebaseError', () => {
        console.error("Event: firebaseError received.");
        // Error message is displayed by inline script's catch block
        disableButton(loginSubmitButton);
        disableButton(resetSubmitButton);
        hideLoader(); // Ensure loader is hidden
    });

    // --- Login Form Submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Login form submitted.");
            // Use the locally assigned 'auth' variable
            if (!auth || !window.signInWithEmailAndPassword) {
                showMessage(loginMessage, 'Auth service not ready. Please refresh.', true);
                console.error("Login attempt failed: auth service not ready.");
                return;
            }

            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();
            clearMessage(loginMessage);

            if (!email || !password) {
                showMessage(loginMessage, 'Please enter both email and password.', true);
                return;
            }

            showLoader();
            disableButton(loginSubmitButton);

            try {
                console.log(`Attempting Firebase sign in for: ${email}`);
                const userCredential = await window.signInWithEmailAndPassword(auth, email, password);
                console.log("Firebase sign in successful for:", userCredential.user.email);
                // Redirect will be triggered by the onAuthStateChanged listener now recognizing the user

            } catch (error) {
                console.error("Firebase Login Error:", error.code, error.message);
                let userMessage = 'Login failed. Please try again.';
                // ... (keep existing error code checks) ...
                 if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    userMessage = 'Invalid email or password.';
                } else if (error.code === 'auth/invalid-email') {
                    userMessage = 'Please enter a valid email address.';
                } else if (error.code === 'auth/too-many-requests') {
                    userMessage = 'Access temporarily disabled (too many attempts). Try again later.';
                } else if (error.code === 'auth/network-request-failed') {
                     userMessage = 'Network error. Please check your connection.';
                }
                showMessage(loginMessage, userMessage, true);
                hideLoader(); // Hide loader on error
                enableButton(loginSubmitButton); // Re-enable button on error

            }
            // No finally block needed here as onAuthStateChanged handles success redirect/loader hiding
        });
    } else {
        console.error("Login form element not found.");
    }

    // --- Forgot Password Link ---
    if (forgotPasswordLink && loginSection && resetPasswordSection) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Forgot Password link clicked.");
            loginSection.style.display = 'none';
            resetPasswordSection.style.display = 'block';
            clearMessage(loginMessage);
            clearMessage(resetMessage);
            resetEmailInput.value = loginEmailInput.value;
            resetEmailInput.focus();
        });
    }

    // --- Cancel Password Reset ---
     if (cancelResetButton && loginSection && resetPasswordSection) {
        cancelResetButton.addEventListener('click', () => {
            console.log("Cancel Reset button clicked.");
            resetPasswordSection.style.display = 'none';
            loginSection.style.display = 'block';
            clearMessage(resetMessage);
            loginEmailInput.focus();
        });
     }

    // --- Reset Password Form Submission ---
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Reset Password form submitted.");
             if (!auth || !window.sendPasswordResetEmail) {
                showMessage(resetMessage, 'Reset service not ready. Please refresh.', true);
                console.error("Reset attempt failed: auth service not ready.");
                return;
            }

            const email = resetEmailInput.value.trim();
            clearMessage(resetMessage);

            if (!email) {
                 showMessage(resetMessage, 'Please enter your email address.', true);
                 return;
            }

            showLoader();
            disableButton(resetSubmitButton);

            try {
                 console.log(`Attempting password reset for: ${email}`);
                 await window.sendPasswordResetEmail(auth, email);
                 console.log("Password reset email sent successfully.");
                 showMessage(resetMessage, 'Password reset link sent! Check your email (including spam).');
                 setTimeout(() => {
                    if (resetPasswordSection.style.display !== 'none') {
                        cancelResetButton.click();
                    }
                 }, 4000);

            } catch (error) {
                console.error("Password Reset Error:", error.code, error.message);
                 let userMessage = 'Failed to send reset email. Please try again.';
                 // ... (keep existing error code checks) ...
                  if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                     userMessage = 'Email address not found or invalid.';
                 } else if (error.code === 'auth/network-request-failed') {
                     userMessage = 'Network error. Please check your connection.';
                 }
                 showMessage(resetMessage, userMessage, true);
            } finally {
                hideLoader();
                enableButton(resetSubmitButton);
            }
        });
    } else {
        console.error("Reset password form element not found.");
    }

    console.log("Login Desktop JS Initialized and Setup Complete (Dark Blue Theme).");
}); // End DOMContentLoaded
