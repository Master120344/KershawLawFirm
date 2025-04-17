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
    // const bodyElement = document.body; // Body class not used now

    // --- Helper Functions ---
    const showLoader = () => { if (loader) loader.style.display = 'block'; };
    const hideLoader = () => { if (loader) loader.style.display = 'none'; };

    const showMessage = (element, message, isError = false) => {
        if (!element) return;
        element.textContent = message;
        element.className = `message ${isError ? 'error' : 'success'} visible`;
    };

    const clearMessage = (element) => {
        if (!element) return;
        element.textContent = '';
        element.className = 'message';
    };

    const disableButton = (button) => { if (button) button.disabled = true; };
    const enableButton = (button) => { if (button) button.disabled = false; };


    // --- Firebase Readiness Check ---
    let auth; // Variable to hold Firebase auth instance

    document.addEventListener('firebaseReady', () => {
        console.log("Firebase is ready (Login Page).");
        if (window.firebaseAuth) {
            auth = window.firebaseAuth;
            // Check initial auth state (optional - redirect if already logged in)
            if (window.onAuthStateChanged) {
                window.onAuthStateChanged(auth, (user) => {
                    if (user) {
                        console.log("User already logged in:", user.email, "Redirecting to dashboard.");
                        // Optionally show a quick message before redirect
                        // showMessage(loginMessage, "Already logged in. Redirecting...");
                        window.location.href = 'client_dashboard_desktop.html'; // Adjust path if needed
                    } else {
                        console.log("No user logged in.");
                         // Ensure login form is visible if reset was previously shown
                         if (loginSection && resetPasswordSection) {
                            loginSection.style.display = 'block';
                            resetPasswordSection.style.display = 'none';
                         }
                    }
                });
            }
        } else {
            console.error("Firebase Auth object not found on window after firebaseReady event.");
            showMessage(loginMessage, 'Authentication service failed to load.', true);
        }
    });

    document.addEventListener('firebaseError', () => {
        console.error("Firebase failed to initialize (Login Page).");
        // Message already shown in HTML script catch block
        disableButton(loginSubmitButton); // Disable login if Firebase fails
    });

    // --- Login Form Submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!auth || !window.signInWithEmailAndPassword) {
                showMessage(loginMessage, 'Authentication service not available.', true);
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
                console.log(`Attempting login for: ${email}`);
                await window.signInWithEmailAndPassword(auth, email, password);
                console.log("Login successful.");
                // showMessage(loginMessage, "Login successful! Redirecting..."); // Optional message
                // onAuthStateChanged should trigger the redirect via the listener added in 'firebaseReady'
                // Or redirect immediately here:
                window.location.href = 'client_dashboard_desktop.html'; // Adjust path if needed

            } catch (error) {
                console.error("Login Error:", error);
                let userMessage = 'Login failed. Please check your credentials.';
                // Customize error messages based on Firebase error codes
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    userMessage = 'Invalid email or password.';
                } else if (error.code === 'auth/invalid-email') {
                    userMessage = 'Please enter a valid email address.';
                } else if (error.code === 'auth/too-many-requests') {
                    userMessage = 'Access temporarily disabled due to too many attempts. Please try again later.';
                }
                showMessage(loginMessage, userMessage, true);
                hideLoader();
                enableButton(loginSubmitButton);
            }
            // Hiding loader might happen before redirect completes, which is fine.
            // If showing message before redirect, hide loader in the success case too.
            // hideLoader();
        });
    } else {
        console.error("Login form not found.");
    }

    // --- Forgot Password Link ---
    if (forgotPasswordLink && loginSection && resetPasswordSection) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Forgot Password clicked.");
            loginSection.style.display = 'none'; // Hide login form
            resetPasswordSection.style.display = 'block'; // Show reset form
            clearMessage(loginMessage); // Clear any previous login messages
            clearMessage(resetMessage); // Clear any previous reset messages
            resetEmailInput.value = loginEmailInput.value; // Pre-fill email if entered
            resetEmailInput.focus();
        });
    }

    // --- Cancel Password Reset ---
     if (cancelResetButton && loginSection && resetPasswordSection) {
        cancelResetButton.addEventListener('click', () => {
            console.log("Cancel Reset clicked.");
            resetPasswordSection.style.display = 'none'; // Hide reset form
            loginSection.style.display = 'block'; // Show login form
            clearMessage(resetMessage);
        });
     }

    // --- Reset Password Form Submission ---
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
             if (!auth || !window.sendPasswordResetEmail) {
                showMessage(resetMessage, 'Password reset service not available.', true);
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
                 console.log(`Sending password reset email to: ${email}`);
                 await window.sendPasswordResetEmail(auth, email);
                 console.log("Password reset email sent successfully.");
                 showMessage(resetMessage, 'Password reset link sent! Check your email inbox (and spam folder).');
                 // Optionally hide form or redirect after success
                 // setTimeout(() => {
                 //    resetPasswordSection.style.display = 'none';
                 //    loginSection.style.display = 'block';
                 // }, 4000); // Show success for 4 seconds

            } catch (error) {
                console.error("Password Reset Error:", error);
                 let userMessage = 'Failed to send reset email. Please try again.';
                 if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                     userMessage = 'Email address not found or invalid.';
                 }
                 showMessage(resetMessage, userMessage, true);
            } finally {
                hideLoader();
                enableButton(resetSubmitButton);
            }
        });
    } else {
        console.error("Reset password form not found.");
    }


    console.log("Login Desktop JS Initialized and Setup.");
}); // End DOMContentLoaded
