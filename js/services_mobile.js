document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Mobile JS Initialized.'); // Changed log message

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger earlier on mobile if needed, e.g., 0.05
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation
                // observer.unobserve(entry.target);
            }
            // Optional: Re-animate
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Other Mobile Specific JS (if any) ---

});

// Assume Firebase auth header logic is handled by `js/auth_header_handler_mobile.js` linked in HTML.
