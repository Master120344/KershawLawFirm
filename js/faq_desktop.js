// js/faq_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const faqItems = document.querySelectorAll('.faq-item');

    // --- Fade-in Effect ---
    if (bodyElement) {
        // Delay slightly to ensure styles are loaded
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50); // 50ms delay
    } else {
        console.error("Body element not found.");
    }

    // --- Firebase Auth UI Handling ---
    // Check if Firebase objects are loaded from HTML script
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log("User logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex'; // Use 'flex' as defined in CSS
                if (userEmailSpan) userEmailSpan.textContent = user.email;
            } else {
                // User is signed out
                console.log("User logged out.");
                if (loginButton) loginButton.style.display = 'inline-block'; // Or 'flex' depending on CSS
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = '';
            }
        });

        // Attach logout listener only once
        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                console.log("Logout button clicked.");
                window.firebaseSignOut(auth)
                    .then(() => {
                        console.log("Sign out successful via Firebase.");
                        // UI updates are handled by onAuthStateChanged
                    })
                    .catch((error) => {
                        console.error("Firebase sign out failed:", error);
                        alert("Logout failed. Please try again. Error: " + error.message);
                    });
            });
            logoutButton.setAttribute('data-listener-attached', 'true'); // Mark listener as attached
        }
    } else {
        // Firebase not ready, ensure default state (show login)
        console.error("Firebase Auth functions not found on window. Login/logout UI might not work.");
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    // --- FAQ Accordion Logic ---
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) {
            console.warn("Skipping FAQ item due to missing question or answer element:", item);
            return; // Skip this item if elements are missing
        }

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // --- Collapse all other items first ---
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                     otherItem.querySelector('.faq-answer').style.paddingTop = '0';
                     otherItem.querySelector('.faq-answer').style.paddingBottom = '0';
                }
            });

            // --- Toggle the clicked item ---
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                // Expand: set max-height to the content's scroll height
                // scrollHeight includes content + padding + border
                answer.style.maxHeight = answer.scrollHeight + 'px';
                // Re-apply padding smoothly using CSS transitions
                answer.style.paddingTop = '20px'; // Match CSS padding
                answer.style.paddingBottom = '25px'; // Match CSS padding
                console.log(`Expanded item. Calculated scrollHeight: ${answer.scrollHeight}px`);
            } else {
                // Collapse: set max-height back to 0
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                 console.log("Collapsed item.");
            }
        });
    });

    console.log("FAQ Desktop JS Initialized Successfully.");
});
