document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Desktop JS Initialized.');

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
            // Optional: To re-animate every time it scrolls into view (remove unobserve)
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select all elements to be animated
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    // Observe each element
    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Optional: Add any other specific JS needed for this page ---
    // For example, handling interactions, sliders, etc. (none requested yet)

});

// Note: The Firebase auth header logic is assumed to be in a separate
// shared file (e.g., `js/auth_header_handler.js`) linked in the HTML,
// or you could copy the relevant `setupFirebaseAuthUi` function and
// its associated listeners directly into this file if preferred.
