// js/payment_portal_mobile.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const paymentForm = document.getElementById('payment-portal-form');
    const paymentSection = document.getElementById('payment-form');
    const successSection = document.getElementById('payment-success');
    const confirmationEmail = document.getElementById('confirmation-email');

    // Fade-in Effect
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found.");
    }

    // Simulate Logged-in State (No API)
    if (loginButton) loginButton.style.display = 'inline-block';
    if (userInfoDiv) userInfoDiv.style.display = 'none';

    // Payment Form Submission (Simple UI Transition)
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Payment form submitted.");

            // Simulate payment success
            const email = "test@gmail.com"; // Default for demo
            if (confirmationEmail) confirmationEmail.textContent = email;
            if (userInfoDiv) {
                userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = email;
            }
            if (loginButton) loginButton.style.display = 'none';

            // Smooth Transition to Success
            paymentSection.style.transition = 'opacity 0.5s ease';
            paymentSection.style.opacity = '0';
            setTimeout(() => {
                paymentSection.style.display = 'none';
                successSection.style.display = 'block';
                successSection.style.opacity = '0';
                setTimeout(() => {
                    successSection.classList.add('visible');
                }, 10); // Slight delay for display to take effect
            }, 500); // Match transition duration
        });
    }

    // Logout Handler (No API)
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Logout clicked.");

            // Simulate logout
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            if (userEmailSpan) userEmailSpan.textContent = '';
            console.log("Logout simulated.");
        });
    }

    console.log("Payment Portal Mobile JS Initialized.");
});