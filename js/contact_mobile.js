document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors (Updated to match new IDs)
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const contactForm = document.getElementById('contact-form'); // Fixed ID
    const thankYouMessage = document.getElementById('thank-you-message'); // Fixed ID

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

    // Contact Form Submission Handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                message: formData.get('message'),
                submittedAt: new Date().toISOString()
            };

            // Simulate saving data and sending email
            console.log("Saving contact inquiry data:", data);
            console.log("Triggering email to robert.kershaw@kershawlaw.com with details:", {
                to: "robert.kershaw@kershawlaw.com",
                subject: `New Contact Inquiry: ${data.service}`,
                body: `
                    Name: ${data.name}
                    Email: ${data.email}
                    Phone: ${data.phone}
                    Service Needed: ${data.service}
                    Message: ${data.message}
                    Submitted: ${data.submittedAt}
                `
            });

            // Transition to Thank You Message
            contactForm.style.transition = 'opacity 0.3s ease';
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                thankYouMessage.style.display = 'block';
                thankYouMessage.style.transition = 'opacity 0.5s ease-in-out';
                setTimeout(() => {
                    thankYouMessage.classList.add('visible');
                }, 50);
            }, 300);

            // Reset form (optional, remove if not desired)
            // contactForm.reset();
        });
    } else {
        console.error("Contact form not found. Check ID 'contact-form'.");
    }

    // Enhance touch responsiveness
    document.querySelectorAll('.tabs a, .submit-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});