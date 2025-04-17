document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const bodyElement = document.body;
    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const userNameSpan = document.getElementById('user-name');
    // Removed footerYear selector, assuming it's handled by inline script or not present

    console.log("Contact Desktop JS Initialized.");

    // Fade-in Effect for Page Body on Load
    if (bodyElement) {
        // Use setTimeout for simplicity, ensure styles are applied first
        setTimeout(() => {
             bodyElement.classList.add('loaded');
             console.log("Body fade-in triggered (Desktop Contact).");
        }, 50); // Small delay
    } else {
         console.error("Body element not found (Desktop Contact).");
    }

    // Contact Form Submission Handler
    if (contactForm && thankYouMessage && userNameSpan) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission (page refresh)
            console.log("Contact form submission initiated.");

            // --- Form Data Collection ---
            const formData = new FormData(contactForm);
            const name = formData.get('name')?.trim() || 'Valued Client'; // Use fallback name
            const email = formData.get('email')?.trim();
            const phone = formData.get('phone')?.trim();
            const service = formData.get('service');
            const message = formData.get('message')?.trim();

            // Basic Validation Example (can be expanded)
            if (!name || !email || !service || !message) {
                alert('Please fill out all required fields (Name, Email, Service, Message).');
                console.warn("Form submission blocked due to missing required fields.");
                return; // Stop submission
            }

             const submissionData = {
                name: name,
                email: email,
                phone: phone || 'Not Provided', // Handle optional phone
                service: service,
                message: message,
                submittedAt: new Date().toISOString(),
                page: 'Desktop Contact'
            };

            // --- Simulation ---
            // In a real application, you would send this data to a server/backend
            console.log("--- Simulating Backend Interaction ---");
            console.log("Data to be sent:", JSON.stringify(submissionData, null, 2));
            // **Important:** The email address here is just console logging the simulated destination.
            // The actual destination depends on your (unseen) backend logic.
            // Ensure your backend sends emails to support@kershawlaw.com
            console.log("Simulating processing for submission (destination should be support@kershawlaw.com)...");
            console.log("--- Simulation Complete ---");


            // --- UI Update: Show Thank You Message ---

            // Update Thank You message content
            userNameSpan.textContent = name; // Display the name entered

            // Smoothly hide the form and show the thank you message
            contactForm.style.opacity = '0';
            contactForm.style.pointerEvents = 'none'; // Prevent interaction during transition

            setTimeout(() => {
                contactForm.style.display = 'none'; // Hide form completely after fade out

                thankYouMessage.style.display = 'block'; // Make thank you message block-level
                 // Use rAF for smoother visual transition start
                 requestAnimationFrame(() => {
                     // Make sure the 'visible' class exists in your CSS with opacity: 1 and transition
                     thankYouMessage.style.opacity = '1'; // Directly set opacity for fade-in
                    console.log("Thank you message displayed.");
                     // Scroll to the thank you message if needed (optional)
                     thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                 });

            }, 400); // Wait for form fade-out transition (match CSS duration)

            // Optional: Reset the form fields after submission (uncomment if desired)
            // contactForm.reset();
            // console.log("Form fields reset.");

        });
    } else {
        // Log errors if essential elements are missing
        if (!contactForm) console.error("Contact form element (#contact-form) not found.");
        if (!thankYouMessage) console.error("Thank you message element (#thank-you-message) not found.");
        if (!userNameSpan) console.error("User name span element (#user-name) not found.");
    }
});
