document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Desktop ENHANCED JS Initialized.');

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully in view from bottom
        threshold: 0.1 // Start when 10% is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add 'is-visible' class to trigger CSS transition/animation
                entry.target.classList.add('is-visible');

                // Set stagger delay based on CSS variable or index if needed
                // The CSS already uses --animation-order, so ensure that's set in HTML or here
                // Example: entry.target.style.transitionDelay = `${index * 100}ms`;

                // Optional: Unobserve after the animation has triggered once
                observer.unobserve(entry.target);
            }
            // Optional: To re-animate every time it scrolls into view (remove unobserve)
            // else {
            //     // Only remove if you want elements to fade out when scrolling past
            //     // entry.target.classList.remove('is-visible');
            // }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select all elements intended for scroll animation
    const elementsToAnimate = document.querySelectorAll('[data-animation]');

    // Observe each element
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Optional: Header Scroll Effect ---
    // const header = document.querySelector('.header');
    // if (header) {
    //     window.addEventListener('scroll', () => {
    //         if (window.scrollY > 50) { // Add class after scrolling 50px
    //             document.body.classList.add('scrolled');
    //         } else {
    //             document.body.classList.remove('scrolled');
    //         }
    //     });
    // }

    // --- Add any other sophisticated JS interactions here ---
    // e.g., parallax effects, interactive graphs (if applicable), etc.

});

// Ensure the shared 'auth_header_handler.js' is linked in the HTML
// to handle the login/logout display in the header.
