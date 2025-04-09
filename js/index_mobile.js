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
        }, 50);
    }

    // Simulate Logged-in State (No API)
    if (loginButton) loginButton.style.display = 'inline-block';
    if (userInfoDiv) userInfoDiv.style.display = 'none';

    // Logout Handler (No API)
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Logout clicked.");
            if (loginButton) loginButton.style.display = 'inline-block';
            if (userInfoDiv) userInfoDiv.style.display = 'none';
            if (userEmailSpan) userEmailSpan.textContent = '';
            console.log("Logout simulated.");
        });
    }

    // Touch Optimization
    document.querySelectorAll('.tabs a, .cta-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});