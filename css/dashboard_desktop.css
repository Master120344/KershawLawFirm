document.addEventListener('DOMContentLoaded', () => {

    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.main-content .content-section');
    const mainContentTitle = document.getElementById('main-content-title');
    const currentYearSpan = document.getElementById('current-year');
    const logoutButton = document.getElementById('logout-button'); // Assuming you have a logout button with this ID

    // Set current year in sidebar footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Function to switch active content section
    function switchContent(targetId) {
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the target content section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');

            // Update header title (optional - find title within section or use link text)
            const sectionTitle = targetSection.querySelector('h2'); // Assumes each section has an H2
            if (mainContentTitle && sectionTitle) {
                 mainContentTitle.textContent = sectionTitle.textContent;
            } else if (mainContentTitle) {
                // Fallback to link text if no H2 found
                 const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                 if (activeLink) {
                     // Extract text, remove icon placeholder if necessary
                     mainContentTitle.textContent = activeLink.textContent.replace(/\[.*?\]\s*/, '').trim();
                 }
            }

        } else {
            console.warn(`Content section with ID "${targetId}" not found.`);
            // Optionally show a default section like overview
            const overviewSection = document.getElementById('overview-content');
             if (overviewSection) {
                 overviewSection.classList.add('active');
                  if (mainContentTitle) mainContentTitle.textContent = "Dashboard Overview";
             }
        }
    }

    // Add click listeners to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor link behavior

            // Get the target content ID from data attribute
            const targetContentId = link.getAttribute('data-target');

            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add active class to the clicked link
            link.classList.add('active');

            // Switch the content area
            if (targetContentId) {
                switchContent(targetContentId);
            } else {
                console.error("Link does not have a data-target attribute:", link);
            }
        });
    });

    // Logout Button Placeholder Functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log("Logout action triggered.");
            // Add actual Firebase logout logic here later
            alert("Logout functionality needs to be implemented with Firebase.");
            // Example: window.firebaseSignOut(window.firebaseAuth).then(...)
            // After successful logout, redirect to login page:
            // window.location.href = 'login.html';
        });
    }

    // Initialize: Ensure the default view (Overview) is shown on load
    // It should already be marked as active in HTML/CSS, but this confirms
     const initialActiveLink = document.querySelector('.sidebar-nav .nav-link.active');
     if (initialActiveLink) {
         const initialTargetId = initialActiveLink.getAttribute('data-target');
         if (initialTargetId) {
            // switchContent(initialTargetId); // Call switchContent to set the header title correctly
            // Correction: Ensure the default title is set without simulating a click
            const initialSection = document.getElementById(initialTargetId);
            const initialSectionTitle = initialSection ? initialSection.querySelector('h2') : null;
             if (mainContentTitle && initialSectionTitle) {
                 mainContentTitle.textContent = initialSectionTitle.textContent;
             } else if (mainContentTitle) {
                 mainContentTitle.textContent = "Dashboard Overview"; // Default
             }
         }
     }


}); // End DOMContentLoaded