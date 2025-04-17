document.addEventListener('DOMContentLoaded', () => {
    console.log('Services Desktop JS Initialized (Enhanced Light Blue Theme).');

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before fully in view
        threshold: 0.1 // 10% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // CSS handles stagger via --animation-order variable
                observer.unobserve(entry.target); // Optimize by unobserving
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select elements for scroll animation using the data-attribute
    const elementsToAnimate = document.querySelectorAll('[data-animation]');

    if (elementsToAnimate.length > 0) {
        elementsToAnimate.forEach(el => {
            scrollObserver.observe(el);
        });
        console.log(`Observing ${elementsToAnimate.length} elements for scroll animation.`);
    } else {
        console.warn("No elements found for scroll animation ([data-animation]).");
    }


    // --- Footer Year Update (Optional - if footer exists) ---
    const footerYearSpan = document.getElementById('current-year');
    if (footerYearSpan) {
        footerYearSpan.textContent = new Date().getFullYear();
        console.log("Footer year updated.");
    } else {
        // This is fine if you don't have the #current-year span in your footer
        // console.warn("Optional footer year span (#current-year) not found.");
    }

     // --- Loader Hiding (Assuming loader exists in HTML) ---
     const loader = document.getElementById('loader');
     if (loader) {
        window.addEventListener('load', () => { // Wait for all resources
            setTimeout(() => {
                 loader.classList.add('hidden');
                 console.log("Loader hidden.");
            }, 200); // Short delay after page load
        });
     }

});

// Note: Assumes shared 'auth_header_handler.js' or inline Firebase script handles header auth state.
// If not, add the necessary Firebase UI handling logic here as seen in index_desktop.js
