// Wait for the DOM to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // --- Firebase Authentication Logic ---
    const auth = window.firebaseAuth; // Get from window object (set in HTML)
    const onAuthStateChanged = window.firebaseOnAuthStateChanged;
    const signOut = window.firebaseSignOut;

    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');

    // Basic check if elements and Firebase functions exist
    if (!auth || !onAuthStateChanged || !signOut || !userInfo || !userEmail || !logoutButton || !loginButton) {
        console.error("Essential elements or Firebase functions not found. Check HTML IDs and Firebase initialization script.");
        // Optionally, display a user-friendly error on the page
        // document.body.innerHTML = "<p style='color: red; text-align: center; padding-top: 150px;'>Error loading page components. Please contact support.</p>";
        return; // Stop script execution if critical parts are missing
    }

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (loginButton) loginButton.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex'; // Use 'flex' as it's a flex container
            if (userEmail) userEmail.textContent = user.email;
            console.log("User is signed in:", user.email);
        } else {
            // User is signed out
            if (loginButton) loginButton.style.display = 'flex'; // Show login button (use flex)
            if (userInfo) userInfo.style.display = 'none';
            if (userEmail) userEmail.textContent = ''; // Clear email display
            console.log("User is signed out.");
        }
    });

    // Add event listener for the logout button
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        signOut(auth)
            .then(() => {
                console.log('User successfully logged out.');
                // Optional: Add redirect or UI update after logout
                // window.location.reload(); // Simple refresh
            })
            .catch((error) => {
                console.error('Logout error:', error);
                alert('Logout failed. Please try again.'); // Simple user feedback
            });
    });

    // --- Navigation Tab Handling ---
    document.querySelectorAll('.tabs .tab-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Check if it's an external link (doesn't start with #)
            if (href && !href.startsWith('#')) {
                e.preventDefault(); // Prevent immediate navigation

                // Apply fade-out effect
                document.body.style.transition = 'opacity 0.3s ease-out';
                document.body.style.opacity = '0';

                // Navigate after fade-out
                setTimeout(() => {
                    window.location.href = href;
                }, 300); // Match transition duration
            }
            // If it's an internal link (#) or has no href, let default behavior (or other JS) handle it
            // Note: Active class handling could be added here if needed for single-page scrolling sections
        });
    });

    // --- Section Reveal Animation on Scroll ---
    const sectionsToReveal = document.querySelectorAll('.section');

    const revealSectionCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a delay based on the element's order in the NodeList
                // Use setTimeout to stagger the animation start
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150); // Stagger delay (adjust 150ms as needed)

                // Stop observing the element once it has been revealed
                observer.unobserve(entry.target);
            }
        });
    };

    // Set up the Intersection Observer
    const sectionObserver = new IntersectionObserver(revealSectionCallback, {
        root: null, // Use the viewport as the root
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    // Initially hide sections and start observing them
    sectionsToReveal.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)'; // Start slightly lower
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Smooth transition
        sectionObserver.observe(section);
    });


    // --- Dynamic Header Shadow on Scroll ---
    // Cache the header element
    const headerElement = document.querySelector('.header');
    if (headerElement) {
        window.addEventListener('scroll', () => {
            // Add shadow when scrolled down, remove when near the top
            if (window.scrollY > 30) {
                 headerElement.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.4)';
            } else {
                 headerElement.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.3)'; // Initial shadow
            }
        }, { passive: true }); // Improve scroll performance
    }

}); // End of DOMContentLoaded listener
