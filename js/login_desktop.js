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
    const initErrorMessage = document.getElementById('init-error-message'); // Get init error element

    // --- Helper Functions ---
    const showLoader = () => { if (loader) loader.style.display = 'block'; };
    const hideLoader = () => { if (loader) loader.style.display = 'none'; };

    const showMessage = (element, message, isError = false) => {
        if (!element) return;
        element.textContent = message;
        element.className = `message ${isError ? 'error' : 'success'} visible`;
        // Auto-clear message after a delay
        setTimeout(() => clearMessage(element), 5000); // Clear after 5 seconds
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
        console.log("Firebase is ready (Login Page - Dark Blue).");
        hideLoader(); // Hide loader once Firebase confirms ready
        if (window.firebaseAuth) {
            auth = window.firebaseAuth;
            // Check initial auth state
            if (window.onAuthStateChanged) {
                window.onAuthStateChanged(auth, (user) => {
                    if (user) {
                        console.log("User already logged in:", user.email, "Redirecting to dashboard.");
                        // Prevent flicker: Ensure login form is hidden before redirect if it was briefly shown
                        if(loginSection) loginSection.style.display = 'none';
                        if(resetPasswordSection) resetPasswordSection.style.display = 'none';
                        window.location.href = 'client_dashboard_desktop.html';
                    } else {
                        console.log("No user logged in. Showing login form.");
                         if (loginSection && resetPasswordSection) {
                            loginSection.style.display = 'block'; // Show login form now
                            resetPasswordSection.style.display = 'none';
                         }
                         // Loader is already hidden by this point
                    }
                }, (error) => {
                    console.error("Error checking auth state:", error);
                    showMessage(loginMessage, 'Could not check login status.', true);
                    hideLoader(); // Ensure loader hidden on error too
                    if(loginSection) loginSection.style.display = 'block'; // Show login form on error
                });
            }
        } else {
            console.error("Firebase Auth object not found on window after firebaseReady event.");
            showMessage(loginMessage, 'Authentication service failed to load.', true);
            hideLoader(); // Hide loader if auth object not found
        }
    });

    document.addEventListener('firebaseError', () => {
        console.error("Firebase failed to initialize (Login Page - Dark Blue).");
        // Message is displayed by inline script
        disableButton(loginSubmitButton);
        disableButton(resetSubmitButton);
        hideLoader(); // Hide loader on init error
    });

    // --- Login Form Submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!auth || !window.signInWithEmailAndPassword) {
                showMessage(loginMessage, 'Authentication service not ready. Please wait or refresh.', true);
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
                const userCredential = await window.signInWithEmailAndPassword(auth, email, password);
                console.log("Login successful. User:", userCredential.user.email);
                // Redirect is handled by onAuthStateChanged listener which fires upon successful login

            } catch (error) {
                console.error("Login Error:", error.code, error.message);
                let userMessage = 'Login failed. Please try again.';
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

            } finally {
                hideLoader();
                enableButton(loginSubmitButton);
            }
        });
    } else {
        console.error("Login form not found.");
    }

    // --- Forgot Password Link ---
    if (forgotPasswordLink && loginSection && resetPasswordSection) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Forgot Password clicked.");
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
            console.log("Cancel Reset clicked.");
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
             if (!auth || !window.sendPasswordResetEmail) {
                showMessage(resetMessage, 'Password reset service not ready. Please wait or refresh.', true);
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
                 showMessage(resetMessage, 'Password reset link sent! Check your email (including spam).');
                 // Hide reset form and show login form after a delay
                 setTimeout(() => {
                    if (resetPasswordSection.style.display !== 'none') {
                        cancelResetButton.click(); // Simulate clicking cancel
                    }
                 }, 4000);

            } catch (error) {
                console.error("Password Reset Error:", error.code, error.message);
                 let userMessage = 'Failed to send reset email. Please try again.';
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
        console.error("Reset password form not found.");
    }

    console.log("Login Desktop JS Initialized and Setup (Dark Blue Theme).");
}); // End DOMContentLoaded
