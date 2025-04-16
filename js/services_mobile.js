document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Mobile JS Initialized (Brighter Theme).'); // Log clarity

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        // Adjust rootMargin slightly for mobile potentially
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Unobserve after trigger
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select elements for scroll animation
    const elementsToAnimate = document.querySelectorAll('[data-animation]');

    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
        console.log(`Observing ${elementsToAnimate.length} elements for scroll animation (Mobile).`);
    } else {
        console.warn("No elements found for scroll animation ([data-animation]) (Mobile).");
    }

    // --- Footer Year Update (Removed - No footer element in mobile HTML) ---
    // const footerYearSpan = document.getElementById('current-year');
    // if (footerYearSpan) {
    //     footerYearSpan.textContent = new Date().getFullYear();
    // } else {
    //     // This is expected now, so maybe remove the warning or make it less prominent
    //     // console.warn("Footer year span (#current-year) not found (Mobile - Expected).");
    // }

});

// Assumes shared 'auth_header_handler.js' is linked in HTML for header auth state.
