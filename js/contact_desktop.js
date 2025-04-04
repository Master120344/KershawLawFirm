// js/contact_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const bodyElement = document.body;
    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const userNameSpan = document.getElementById('user-name');
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const navTabs = document.getElementById('nav-tabs');

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
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = user.email;

                // Update tabs for logged-in state
                if (navTabs) {
                    navTabs.innerHTML = `
                        <a href="/KershawLawFirm/index2_desktop.html" id="tab-home">Home</a>
                        <a href="/KershawLawFirm/visah2a_desktop.html" id="tab-h2a">H2-A</a>
                        <a href="/KershawLawFirm/visah2b_desktop.html" id="tab-h2b">H2-B</a>
                        <a href="/KershawLawFirm/videos_desktop.html" id="tab-videos">Videos</a>
                        <a href="/KershawLawFirm/contact_desktop.html" id="tab-contact" class="active">Contact</a>
                    `;
                }
            } else {
                console.log("User logged out.");
                if (loginButton) loginButton.style.display = 'inline-block';
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';

                // Reset tabs to logged-out state
                if (navTabs) {
                    navTabs.innerHTML = `
                        <a href="/KershawLawFirm/index_desktop.html" id="tab-home">Home</a>
                        <a href="/KershawLawFirm/faq_desktop.html" id="tab-faq">FAQ</a>
                        <a href="/KershawLawFirm/contact_desktop.html" id="tab-contact" class="active">Contact Us</a>
                    `;
                }
            }
        });

        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Logout clicked.");
                window.firebaseSignOut(auth)
                    .then(() => {
                        console.log("Sign out successful.");
                        window.location.href = '/KershawLawFirm/login_desktop.html';
                    })
                    .catch((error) => {
                        console.error("Logout failed:", error);
                        alert("Logout failed. Please try again.");
                    });
            });
            logoutButton.setAttribute('data-listener-attached', 'true');
        }
    } else {
        console.error("Firebase Auth not initialized.");
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    // Contact Form Submission Handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                message: formData.get('message'),
                submittedAt: new Date().toISOString()
            };

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

            userNameSpan.textContent = data.name;
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

            contactForm.reset();
        });
    } else {
        console.error("Contact form not found. Check ID 'contact-form'.");
    }

    console.log("Contact Desktop JS Initialized.");
});
