// Security: Function to sanitize text to prevent XSS
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const loader = document.getElementById('loader');

    // Show loader initially
    if (loader) {
        loader.style.display = 'block';
    }

    // Fade-in Effect and Hide Loader
    if (bodyElement && loader) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            loader.classList.add('hidden');
            // Remove loader from DOM after transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Matches CSS transition duration
        }, 1000); // Simulate loading delay (adjust as needed)
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

    // Security: Example for sanitizing user email if dynamically set later
    if (userEmailSpan && userEmailSpan.textContent) {
        userEmailSpan.textContent = sanitizeText(userEmailSpan.textContent);
    }

    // Future Cloudflare Note: Add async loading for scripts when integrating Cloudflare
    // Example: <script async src="https://cdnjs.cloudflare.com/..."></script>
});