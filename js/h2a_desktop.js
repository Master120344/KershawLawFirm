// js/h2a_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const bodyElement = document.body;
    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');

    // Fade-in Effect
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found.");
    }

    // Firebase Authentication Logic
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfo) userInfo.style.display = 'flex';
                if (userEmail) userEmail.textContent = user.email;
            } else {
                console.log("User logged out, redirecting to login.");
                if (loginButton) loginButton.style.display = 'inline-block';
                if (userInfo) userInfo.style.display = 'none';
                if (userEmail) userEmail.textContent = '';
                window.location.href = '/KershawLawFirm/login_desktop.html';
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
        if (userInfo) userInfo.style.display = 'none';
        window.location.href = '/KershawLawFirm/login_desktop.html';
    }

    // Section Reveal Animation on Scroll
    const sectionsToReveal = document.querySelectorAll('.section');
    const revealSectionCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSectionCallback, {
        root: null,
        threshold: 0.15
    });

    sectionsToReveal.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });

    console.log("H2A Desktop JS Initialized.");
});
