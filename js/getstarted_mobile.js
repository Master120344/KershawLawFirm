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

    // Fade-in Effect for Page Load
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

    // Form Submission Handler with Email Trigger Simulation
    if (prescreenForm) {
        prescreenForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(prescreenForm);
            const data = {
                fullName: formData.get('full-name'),
                companyName: formData.get('company-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                visaType: formData.get('visa-type'),
                workerCount: formData.get('worker-count'),
                message: formData.get('message'),
                submittedAt: new Date().toISOString()
            };

            // Simulate saving data and sending email
            console.log("Saving prescreening data:", data);
            console.log("Triggering email to visa-screening@kershawlawfirm.com with details:", {
                to: "visa-screening@kershawlawfirm.com",
                subject: `New Prescreening Request from ${data.companyName}`,
                body: `
                    Full Name: ${data.fullName}
                    Company: ${data.companyName}
                    Email: ${data.email}
                    Phone: ${data.phone}
                    Visa Type: ${data.visaType}
                    Workers Needed: ${data.workerCount}
                    Details: ${data.message || 'None provided'}
                    Submitted: ${data.submittedAt}
                `
            });

            // Transition to Thank You
            prescreenSection.style.display = 'none';
            thankYouSection.style.display = 'block';
            setTimeout(() => {
                thankYouSection.classList.add('visible');
            }, 50); // Slight delay for smooth fade-in

            // For real implementation, replace console logs with:
            // 1. Save to Firebase Firestore:
            //    firebase.firestore().collection('prescreening').add(data);
            // 2. Send email via backend (e.g., Node.js with Nodemailer or Firebase Functions)
        });
    }

    // Enhance touch responsiveness
    document.querySelectorAll('.tabs a, .submit-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});