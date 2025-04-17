// js/login_mobile.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Login JS - Mobile] DOMContentLoaded.");
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
    const initStatusMessage = document.getElementById('init-status-message');

    // --- Helper Functions ---
    const showLoader = () => { console.log("[Helper - Mobile] Showing loader"); if (loader) loader.style.display = 'block'; };
    const hideLoader = () => { console.log("[Helper - Mobile] Hiding loader"); if (loader) loader.style.display = 'none'; };

    const showMessage = (element, message, isError = false) => {
        if (!element) return;
        console.log(`[Helper - Mobile] Displaying message (${isError ? 'Error' : 'Success'}): ${message}`);
        element.textContent = message;
        element.className = `message ${isError ? 'error' : 'success'} visible`;
        setTimeout(() => clearMessage(element), 6000);
    };

    const clearMessage = (element) => {
        if (!element) return;
        element.textContent = '';
        element.className = 'message';
    };

    const disableButton = (button) => { if (button) button.disabled = true; };
    const enableButton = (button) => { if (button) button.disabled = false; };


    // --- Firebase Readiness Check & Auth State Handling ---
    let auth = null;
    let onAuthStateChangedListener = null;

    function initializeAuthLogicMobile() {
        console.log("[Auth Logic - Mobile] Initializing...");
        if (!window._firebaseAuthInstance) {
            console.error("[Auth Logic - Mobile] Firebase Auth instance not found.");
            showMessage(initErrorMessage, 'Auth service failed. Cannot initialize.', true);
            hideLoader();
            if(loginSection) loginSection.style.display = 'none';
            if(resetPasswordSection) resetPasswordSection.style.display = 'none';
            return;
        }
        auth = window._firebaseAuthInstance;
        console.log("[Auth Logic - Mobile] Auth instance assigned.");

        if (onAuthStateChangedListener) {
            console.log("[Auth Logic - Mobile] Unsubscribing previous listener.");
            onAuthStateChangedListener();
        }

        if (window.onAuthStateChanged) {
            console.log("[Auth Logic - Mobile] Setting up onAuthStateChanged listener...");
            onAuthStateChangedListener = window.onAuthStateChanged(auth, (user) => {
                console.log("[Auth Logic - Mobile] onAuthStateChanged triggered.");
                hideLoader();
                if (user) {
                    console.log("[Auth Logic - Mobile] User IS logged in:", user.email);
                    console.log("[Auth Logic - Mobile] Redirecting to MOBILE dashboard...");
                     if(loginSection) loginSection.style.display = 'none';
                     if(resetPasswordSection) resetPasswordSection.style.display = 'none';
                    // *** MOBILE REDIRECT TARGET ***
                    window.location.href = 'client_dashboard_mobile.html';
                } else {
                    console.log("[Auth Logic - Mobile] No user logged in. Showing login form.");
                    if (!initErrorMessage || initErrorMessage.style.display === 'none') {
                        if (loginSection && resetPasswordSection) {
                            loginSection.style.display = 'block';
                            resetPasswordSection.style.display = 'none';
                            console.log("[Auth Logic - Mobile] Login form displayed.");
                        } else {
                            console.error("[Auth Logic - Mobile] Login/Reset section missing!");
                        }
                    } else {
                         console.log("[Auth Logic - Mobile] Init error visible, not showing form.");
                    }
                }
            }, (error) => {
                console.error("[Auth Logic - Mobile] Error in listener:", error);
                showMessage(loginMessage || initErrorMessage, 'Error checking status. Refresh?', true);
                if(loginSection) loginSection.style.display = 'block';
                hideLoader();
            });
            console.log("[Auth Logic - Mobile] Listener attached.");
        } else {
            console.error("[Auth Logic - Mobile] onAuthStateChanged missing.");
            showMessage(loginMessage || initErrorMessage, 'Critical auth function missing.', true);
            if(loginSection) loginSection.style.display = 'block';
            hideLoader();
        }
    }

    document.addEventListener('firebaseInitSuccess', () => {
        console.log("[Event Listener - Mobile] firebaseInitSuccess received.");
        initializeAuthLogicMobile();
    });

    document.addEventListener('firebaseInitError', () => {
        console.log("[Event Listener - Mobile] firebaseInitError received.");
        disableButton(loginSubmitButton);
        disableButton(resetSubmitButton);
        hideLoader();
    });


    // --- Login Form Submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("[Login Submit - Mobile] Form submitted.");
            if (!auth || !window.signInWithEmailAndPassword) {
                showMessage(loginMessage, 'Auth service init... Please wait.', true);
                console.error("[Login Submit - Mobile] Failed: auth service not ready.");
                return;
            }

            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();
            clearMessage(loginMessage);

            if (!email || !password) {
                showMessage(loginMessage, 'Enter email and password.', true); // Shorter msg
                return;
            }

            showLoader();
            disableButton(loginSubmitButton);

            try {
                console.log(`[Login Submit - Mobile] Attempting sign in: ${email}`);
                const userCredential = await window.signInWithEmailAndPassword(auth, email, password);
                console.log("[Login Submit - Mobile] Sign in successful:", userCredential.user.email);
                // Redirect handled by listener

            } catch (error) {
                console.error("[Login Submit - Mobile] Firebase Login Error:", error.code, error.message);
                let userMessage = 'Login failed.'; // Shorter base msg
                 if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                     userMessage = 'Invalid email or password.';
                 } else if (error.code === 'auth/invalid-email') {
                     userMessage = 'Invalid email format.';
                 } else if (error.code === 'auth/too-many-requests') {
                     userMessage = 'Too many attempts. Try later.';
                 } else if (error.code === 'auth/network-request-failed') {
                      userMessage = 'Network error.';
                 }
                 showMessage(loginMessage, userMessage, true);
                 hideLoader();
                 enableButton(loginSubmitButton);
            }
        });
    } else {
        console.error("Login form element not found (Mobile).");
    }

    // --- Forgot Password Link ---
    if (forgotPasswordLink && loginSection && resetPasswordSection) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("[Forgot Pwd - Mobile] Link clicked.");
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
            console.log("[Reset Pwd - Mobile] Cancel clicked.");
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
            console.log("[Reset Pwd - Mobile] Form submitted.");
             if (!auth || !window.sendPasswordResetEmail) {
                showMessage(resetMessage, 'Reset service not ready.', true);
                console.error("[Reset Pwd - Mobile] Failed: auth service not ready.");
                return;
            }

            const email = resetEmailInput.value.trim();
            clearMessage(resetMessage);

            if (!email) {
                 showMessage(resetMessage, 'Enter your email address.', true);
                 return;
            }

            showLoader();
            disableButton(resetSubmitButton);

            try {
                 console.log(`[Reset Pwd - Mobile] Attempting reset for: ${email}`);
                 await window.sendPasswordResetEmail(auth, email);
                 console.log("[Reset Pwd - Mobile] Email sent.");
                 showMessage(resetMessage, 'Reset link sent! Check email.'); // Shorter msg
                 setTimeout(() => {
                    if (resetPasswordSection.style.display !== 'none') {
                        cancelResetButton.click();
                    }
                 }, 4000);

            } catch (error) {
                console.error("[Reset Pwd - Mobile] Firebase Reset Error:", error.code, error.message);
                 let userMessage = 'Failed to send email.';
                  if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                      userMessage = 'Email not found or invalid.';
                  } else if (error.code === 'auth/network-request-failed') {
                      userMessage = 'Network error.';
                  }
                 showMessage(resetMessage, userMessage, true);
            } finally {
                hideLoader();
                enableButton(resetSubmitButton);
            }
        });
    } else {
        console.error("Reset password form element not found (Mobile).");
    }

    console.log("Login Mobile JS Initialized and Setup Complete.");
}); // End DOMContentLoaded
