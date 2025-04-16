document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Desktop JS Initialized (Brighter Theme).'); // Log clarity

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before element is fully in view
        threshold: 0.1 // Start when 10% is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // CSS handles stagger via --animation-order variable
                observer.unobserve(entry.target); // Unobserve after trigger
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select elements for scroll animation
    const elementsToAnimate = document.querySelectorAll('[data-animation]'); // Simplified selector, as stagger is handled purely by CSS

    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
        console.log(`Observing ${elementsToAnimate.length} elements for scroll animation.`);
    } else {
        console.warn("No elements found for scroll animation ([data-animation]).");
    }


    // --- Footer Year Update ---
    const footerYearSpan = document.getElementById('current-year');
    if (footerYearSpan) {
        footerYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Footer year span (#current-year) not found.");
    }

});

// Assumes shared 'auth_header_handler.js' is linked in HTML for header auth state.
