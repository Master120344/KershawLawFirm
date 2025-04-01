document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const faqItems = document.querySelectorAll('.faq-item');

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

    // FAQ Accordion Functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            if (!isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });

        // Touch enhancement
        question.addEventListener('touchstart', () => {}, { passive: true });
    });

    // Enhance touch responsiveness for other elements
    document.querySelectorAll('.tabs a, .cta-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});