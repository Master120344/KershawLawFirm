// js/login_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;

    // Fade-in Effect
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found.");
    }

    // Simple Login Form Submission (No API)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simulate login success (no real auth)
            console.log("Login attempt with:", email);
            loginMessage.textContent = "Login successful! Redirecting...";
            loginMessage.classList.remove('error');
            loginMessage.classList.add('success');

            // Show user info and hide form
            if (loginForm) loginForm.style.display = 'none';
            if (userInfoDiv) userInfoDiv.style.display = 'flex';
            if (userEmailSpan) userEmailSpan.textContent = email;

            // Redirect after a delay (no API dependency)
            setTimeout(() => {
                window.location.href = '/KershawLawFirm/index2_desktop.html';
            }, 1500); // 1.5-second delay to show message
        });
    }

    // Logout Handler (No API)
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Logout clicked.");

            // Simulate logout
            if (loginForm) loginForm.style.display = 'block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            if (userEmailSpan) userEmailSpan.textContent = '';
            console.log("Logout simulated.");
        });
    }

    console.log("Login Desktop JS Initialized.");
});