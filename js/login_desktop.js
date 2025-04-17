// js/login_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("[Login JS] DOMContentLoaded.");
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
    const initStatusMessage = document.getElementById('init-status-message'); // Get status element

    // --- Helper Functions ---
    const showLoader = () => { console.log("[Helper] Showing loader"); if (loader) loader.style.display = 'block'; };
    const hideLoader = () => { console.log("[Helper] Hiding loader"); if (loader) loader.style.display = 'none'; };

    const showMessage = (element, message, isError = false) => {
        if (!element) return;
        console.log(`[Helper] Displaying message (${isError ? 'Error' : 'Success'}): ${message}`);
        element.textContent = message;
        element.className = `message ${isError ? 'error' : 'success'} visible`;
        setTimeout(() => clearMessage(element), 6000); // Increased display time
    };

    const clearMessage = (element) => {
        if (!element) return;
        element.textContent = '';
        element.className = 'message';
    };

    const disableButton = (button) => { if (button) button.disabled = true; };
    const enableButton = (button) => { if (button) button.disabled = false; };


    // --- Firebase Readiness Check & Auth State Handling ---
    let auth = null; // Initialize auth as null
    let onAuthStateChangedListener = null; // To store the listener unsubscribe function

    // Function to initialize auth listeners and UI
    function initializeAuthLogic() {
        console.log("[Auth Logic] Initializing...");
        if (!window._firebaseAuthInstance) {
            console.error("[Auth Logic] Firebase Auth instance not found on window. Cannot proceed.");
            showMessage(initErrorMessage, 'Auth service failed. Cannot initialize login.', true);
             hideLoader();
             if(loginSection) loginSection.style.display = 'none';
             if(resetPasswordSection) resetPasswordSection.style.display = 'none';
            return;
        }
        auth = window._firebaseAuthInstance; // Assign the initialized instance
        console.log("[Auth Logic] Auth instance assigned.");

        // Clean up previous listener if any (safety measure)
        if (onAuthStateChangedListener) {
            console.log("[Auth Logic] Unsubscribing previous auth state listener.");
            onAuthStateChangedListener();
        }

        if (window.onAuthStateChanged) {
            console.log("[Auth Logic] Setting up onAuthStateChanged listener...");
            // Store the unsubscribe function returned by onAuthStateChanged
            onAuthStateChangedListener = window.onAuthStateChanged(auth, (user) => {
                console.log("[Auth Logic] onAuthStateChanged triggered.");
                hideLoader(); // Ensure loader is hidden once state is known
                if (user) {
                    console.log("[Auth Logic] User IS logged in:", user.email);
                    // Optional: Add slight delay before redirect for smoother feel or message
                    // showMessage(loginMessage, "Login successful. Redirecting...", false); // Use login message area
                    // setTimeout(() => {
                         console.log("[Auth Logic] Redirecting to dashboard...");
                         if(loginSection) loginSection.style.display = 'none';
                         if(resetPasswordSection) resetPasswordSection.style.display = 'none';
                         window.location.href = 'client_dashboard_desktop.html';
                    // }, 500); // Example delay
                } else {
                    console.log("[Auth Logic] No user logged in. Showing login form.");
                    // Make sure init error is hidden
                    if (initErrorMessage) initErrorMessage.style.display = 'none';
                    if (loginSection && resetPasswordSection) {
                        loginSection.style.display = 'block';
                        resetPasswordSection.style.display = 'none';
                        console.log("[Auth Logic] Login form displayed.");
                    } else {
                        console.error("[Auth Logic] Login or Reset section element missing!");
                    }
                }
            }, (error) => {
                console.error("[Auth Logic] Error in onAuthStateChanged listener:", error);
                showMessage(loginMessage || initErrorMessage, 'Error checking login status. Refresh maybe?', true);
                 if(loginSection) loginSection.style.display = 'block'; // Default to showing login form on listener error
                 hideLoader();
            });
            console.log("[Auth Logic] onAuthStateChanged listener attached.");
        } else {
            console.error("[Auth Logic] onAuthStateChanged function not found on window.");
            showMessage(loginMessage || initErrorMessage, 'Critical auth function missing (onAuthStateChanged).', true);
            if(loginSection) loginSection.style.display = 'block';
            hideLoader();
        }
    }

    // Listen for successful initialization
    document.addEventListener('firebaseInitSuccess', () => {
        console.log("[Event Listener] firebaseInitSuccess received.");
        initializeAuthLogic(); // Setup listeners and UI state
    });

    // Listen for initialization error
    document.addEventListener('firebaseInitError', () => {
        console.log("[Event Listener] firebaseInitError received.");
        // Error message is displayed by the inline script's catch block
        // Loader is also hidden by the inline script's catch block
        disableButton(loginSubmitButton);
        disableButton(resetSubmitButton);
    });


    // --- Login Form Submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("[Login Submit] Form submitted.");
            // Check if auth is ready locally
            if (!auth || !window.signInWithEmailAndPassword) {
                showMessage(loginMessage, 'Auth service initializing... Please wait a moment.', true);
                console.error("[Login Submit] Failed: auth service not ready.");
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
                console.log(`[Login Submit] Attempting sign in: ${email}`);
                const userCredential = await window.signInWithEmailAndPassword(auth, email, password);
                console.log("[Login Submit] Sign in successful:", userCredential.user.email);
                // Redirect is handled by the onAuthStateChanged listener above

            } catch (error) {
                console.error("[Login Submit] Firebase Login Error:", error.code, error.message);
                let userMessage = 'Login failed. Please try again.';
                 if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                     userMessage = 'Invalid email or password.';
                 } else if (error.code === 'auth/invalid-email') {
                     userMessage = 'Please enter a valid email address.';
                 } else if (error.code === 'auth/too-many-requests') {
                     userMessage = 'Access temporarily disabled (too many attempts). Try again later.';
                 } else if (error.code === 'auth/network-request-failed') {
                     userMessage = 'Network error. Please check your connection.';
                 } else {
                     userMessage = `Login failed: ${error.code}`; // Show code for other errors
                 }
                 showMessage(loginMessage, userMessage, true);
                 hideLoader(); // Hide loader ONLY on error here
                 enableButton(loginSubmitButton);

            }
             // No finally block needed, success case relies on onAuthStateChanged for loader/redirect
        });
    } else {
        console.error("Login form element not found.");
    }

    // --- Forgot Password Link ---
    if (forgotPasswordLink && loginSection && resetPasswordSection) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("[Forgot Pwd] Link clicked.");
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
            console.log("[Reset Pwd] Cancel clicked.");
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
            console.log("[Reset Pwd] Form submitted.");
             if (!auth || !window.sendPasswordResetEmail) {
                showMessage(resetMessage, 'Reset service not ready. Please refresh.', true);
                console.error("[Reset Pwd] Failed: auth service not ready.");
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
                 console.log(`[Reset Pwd] Attempting reset for: ${email}`);
                 await window.sendPasswordResetEmail(auth, email);
                 console.log("[Reset Pwd] Email sent successfully.");
                 showMessage(resetMessage, 'Password reset link sent! Check your email (including spam).');
                 setTimeout(() => {
                    if (resetPasswordSection.style.display !== 'none') {
                        cancelResetButton.click();
                    }
                 }, 4000);

            } catch (error) {
                console.error("[Reset Pwd] Firebase Reset Error:", error.code, error.message);
                 let userMessage = 'Failed to send reset email. Please try again.';
                  if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                     userMessage = 'Email address not found or invalid.';
                 } else if (error.code === 'auth/network-request-failed') {
                     userMessage = 'Network error. Please check your connection.';
                 } else {
                      userMessage = `Reset failed: ${error.code}`;
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

    console.log("[Login JS] Initialization logic complete.");
}); // End DOMContentLoaded
