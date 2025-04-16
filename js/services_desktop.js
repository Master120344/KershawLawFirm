document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Desktop JS Initialized (Enhanced).'); // Log clarity

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully in view from bottom
        threshold: 0.1 // Start when 10% is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => { // Removed unused index
            if (entry.isIntersecting) {
                // Add 'is-visible' class to trigger CSS transition/animation
                entry.target.classList.add('is-visible');

                // CSS handles stagger via --animation-order variable set in HTML

                // Unobserve after the animation has triggered once
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select all elements intended for scroll animation
    // Now targets elements with data-animation AND advantage/step items specifically for stagger
    const elementsToAnimate = document.querySelectorAll('[data-animation], .advantage-item, .step');

    // Observe each element
    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
    } else {
        console.warn("No elements found for scroll animation.");
    }


    // --- Other JS (Keep empty for now) ---

});

// Assumes shared 'auth_header_handler.js' is linked in HTML for header auth state.
