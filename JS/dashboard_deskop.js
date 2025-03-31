document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const sidebar = document.getElementById('sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');
    const mainContentArea = document.getElementById('main-content-area');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYearSpan = document.getElementById('current-year');
    const logoutButton = document.getElementById('logout-button'); // In dropdown now
    const profileMenuContainer = document.querySelector('.profile-menu-container');
    const dropdownLinks = document.querySelectorAll('.profile-dropdown .nav-link-trigger');

    // --- Initial Setup ---

    // Remove preload class to enable transitions after initial render
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100); // Small delay

    // Set current year in sidebar footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Core Functions ---

    // Function to switch active content section
    function switchContent(targetId, targetTitle = null) {
        if (!targetId) {
            console.error("switchContent called with no targetId");
            return;
        }

        let foundSection = false;
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target content section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            foundSection = true;

            // Update header title
            if (mainContentTitle) {
                // Use provided title (from data-title) or fallback to section's H2
                const sectionH2 = targetSection.querySelector('h2');
                mainContentTitle.textContent = targetTitle || (sectionH2 ? sectionH2.textContent : "Dashboard");
            }

            // Scroll content area to top
            if (mainContentArea) {
                mainContentArea.scrollTop = 0;
            }

        } else {
            console.warn(`Content section with ID "${targetId}" not found.`);
            // Fallback: Show overview if target not found
            const overviewSection = document.getElementById('overview-content');
             if (overviewSection) {
                 overviewSection.classList.add('active');
                 if (mainContentTitle) mainContentTitle.textContent = "Dashboard Overview";
             }
        }
         return foundSection; // Return whether the section was found and activated
    }

     // Function to update active sidebar link
     function updateSidebarActiveState(targetId) {
         sidebarLinks.forEach(link => {
             if (link.getAttribute('data-target') === targetId) {
                 link.classList.add('active');
             } else {
                 link.classList.remove('active');
             }
         });
     }

    // --- Event Listeners ---

    // Sidebar link clicks
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetContentId = link.getAttribute('data-target');
            const targetTitle = link.getAttribute('data-title');

            if (switchContent(targetContentId, targetTitle)) {
                 updateSidebarActiveState(targetContentId);
            }
        });
    });

    // Dropdown link clicks (that trigger content switch)
    dropdownLinks.forEach(link => {
         link.addEventListener('click', (event) => {
             event.preventDefault();
             const targetContentId = link.getAttribute('data-target');
             const targetTitle = link.getAttribute('data-title'); // Use data-title if available

             if (targetContentId && switchContent(targetContentId, targetTitle)) {
                 updateSidebarActiveState(targetContentId);
                 // Optional: Close dropdown after click (needs JS)
                 // profileMenuContainer.classList.remove('active'); // Example
             }
        });
    });


    // Logout Button Functionality (Placeholder)
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout action triggered.");
            // === ADD FIREBASE LOGOUT HERE ===
            // Example:
            // const auth = window.firebaseAuth; // Ensure Firebase Auth is exposed to window
            // const signOut = window.firebaseSignOut;
            // if (auth && signOut) {
            //     signOut(auth).then(() => {
            //         console.log("User signed out successfully.");
            //         window.location.href = 'login.html'; // Redirect to login page
            //     }).catch((error) => {
            //         console.error("Logout failed:", error);
            //         alert("Logout failed. Please try again.");
            //     });
            // } else {
            //     alert("Logout functionality not available.");
            // }
            alert("Firebase logout logic needs implementation.");
            // Remove this alert when Firebase logic is added.
        });
    }

    // Add listener for profile button click/hover if needed for dropdown JS control


    // --- Initialization ---
    // Ensure the default view (Overview) is shown and sidebar link is active
    const initialActiveLink = document.querySelector('.sidebar-nav .nav-link.active');
    let initialTargetId = 'overview-content'; // Default fallback
    let initialTitle = 'Dashboard Overview';

    if (initialActiveLink) {
        initialTargetId = initialActiveLink.getAttribute('data-target') || initialTargetId;
        initialTitle = initialActiveLink.getAttribute('data-title') || initialTitle;
    }
    switchContent(initialTargetId, initialTitle); // Set initial content and title


    console.log("Enhanced Dashboard Initialized.");

}); // End DOMContentLoaded