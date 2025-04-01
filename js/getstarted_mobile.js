document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const prescreenForm = document.getElementById('visa-prescreen-form');
    const prescreenSection = document.getElementById('prescreen-form');
    const thankYouSection = document.getElementById('thank-you');

    // Fade-in Effect
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
        }, 50);
    }

    // Firebase Auth Setup
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        // Auth State Listener
        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                loginButton.style.display = 'none';
                userInfoDiv.style.display = 'flex';
                userEmailSpan.textContent = user.email;
            } else {
                loginButton.style.display = 'inline-block';
                userInfoDiv.style.display = 'none';
                userEmailSpan.textContent = '';
            }
        });

        // Logout Handler
        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.firebaseSignOut(auth)
                    .then(() => {
                        // UI updates handled by auth listener
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
        loginButton.style.display = 'inline-block';
        userInfoDiv.style.display = 'none';
    }

    // Form Submission Handler
    if (prescreenForm) {
        prescreenForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission (replace with actual backend logic later)
            console.log("Form submitted with data:", new FormData(prescreenForm));

            // Hide form and show thank you message
            prescreenSection.style.display = 'none';
            thankYouSection.style.display = 'block';

            // Optional: Reset form for testing (comment out for production)
            // prescreenForm.reset();
        });
    }

    // Enhance touch responsiveness
    document.querySelectorAll('.tabs a, .submit-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});