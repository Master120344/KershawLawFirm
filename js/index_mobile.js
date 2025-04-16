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
        }, 1000); // Simulate loading delay
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

    // Navigation with Loader and Cache Refresh
    document.querySelectorAll('.tabs a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (loader) {
                loader.classList.remove('hidden');
                loader.style.display = 'block';
            }
            const href = link.getAttribute('href');
            // Append cache-busting query parameter
            const cacheBustUrl = `${href}?t=${new Date().getTime()}`;
            setTimeout(() => {
                window.location.href = cacheBustUrl;
            }, 500); // Delay to show loader
        });
    });

    // Touch Optimization
    document.querySelectorAll('.tabs a, .cta-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });

    // Security: Sanitize user email if dynamically set
    if (userEmailSpan && userEmailSpan.textContent) {
        userEmailSpan.textContent = sanitizeText(userEmailSpan.textContent);
    }
});