// js/getstarted_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const prescreenForm = document.getElementById('visa-prescreen-form');
    const prescreenSection = document.getElementById('prescreen-form');
    const thankYouSection = document.getElementById('thank-you');

    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found. Fade-in cannot be applied.");
    }

    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        console.log("Firebase auth object found, setting up listener.");

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = user.email;
            } else {
                console.log("User is logged out.");
                if (loginButton) loginButton.style.display = 'inline-block';
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        if (logoutButton) {
            if (!logoutButton.hasAttribute('data-listener-attached')) {
                logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Logout button clicked.");
                    window.firebaseSignOut(auth).then(() => {
                        console.log("Firebase sign out successful.");
                    }).catch((error) => {
                        console.error("Firebase sign out failed:", error);
                        alert("Logout failed. Please try again.");
                    });
                });
                logoutButton.setAttribute('data-listener-attached', 'true');
            }
        }
    } else {
        console.error("Essential Firebase Auth functions not found on window object.");
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    if (prescreenForm) {
        prescreenForm.addEventListener('submit', (e) => {
            e.preventDefault();

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

            prescreenSection.style.display = 'none';
            thankYouSection.style.display = 'block';
            setTimeout(() => {
                thankYouSection.classList.add('visible');
            }, 50);

            // For real implementation:
            // firebase.firestore().collection('prescreening').add(data);
            // Send email via backend (e.g., Firebase Functions)
        });
    }

    console.log("Get Started Desktop JS Initialized.");
});
