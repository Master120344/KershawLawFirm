// js/index2_mobile.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
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

    // Simulate Logged-in State (No API)
    if (loginButton) loginButton.style.display = 'none'; // Assume logged in by default
    if (userInfoDiv) {
        userInfoDiv.style.display = 'flex';
        if (userEmailSpan) userEmailSpan.textContent = 'test@gmail.com'; // Default for demo
    }

    // Logout Handler (No API)
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Logout clicked.");
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            if (userEmailSpan) userEmailSpan.textContent = '';
            console.log("Logout simulated.");
            window.location.href = '/KershawLawFirm/login_mobile.html';
        });
    }

    // Touch Optimization
    document.querySelectorAll('.tabs a, .pay-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });

    console.log("Index2 Mobile JS Initialized.");
});