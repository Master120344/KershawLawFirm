document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const faqItems = document.querySelectorAll('.faq-item');

    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
        }, 50);
    }

    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

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

        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.firebaseSignOut(auth)
                    .then(() => {})
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

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            item.classList.toggle('active');
            if (!isActive) {
                answer.style.maxHeight = `${answer.scrollHeight + 30}px`; /* Add padding to height */
                answer.scrollTop = 0; /* Reset scroll position */
            } else {
                answer.style.maxHeight = '0';
            }
        });

        question.addEventListener('touchstart', () => {}, { passive: true });
    });

    document.querySelectorAll('.tabs a, .cta-button, .login-button, .logout-link').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});