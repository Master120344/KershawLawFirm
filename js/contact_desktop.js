console.log("Contact Desktop JS Initialized.");

// Set current year in footer
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// Fade-in Effect for Page Body on Load
if (bodyElement) {
    // Use requestAnimationFrame for smoother start
    requestAnimationFrame(() => {
         bodyElement.classList.add('loaded');
         console.log("Body fade-in triggered (Desktop Contact).");
    });
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
        // (e.g., using fetch API to your own endpoint, or a service like Formspree, Netlify Forms, Firebase Functions)
        console.log("--- Simulating Backend Interaction ---");
        console.log("Data to be sent:", JSON.stringify(submissionData, null, 2));
        console.log("Simulating email to robert.kershaw@kershawlaw.com...");
        // Placeholder for actual fetch/AJAX call
        // fetch('/api/contact', { method: 'POST', body: JSON.stringify(submissionData), headers: {'Content-Type': 'application/json'} })
        //  .then(response => response.json())
        //  .then(data => { console.log('Success:', data); /* Proceed to show thank you */ })
        //  .catch((error) => { console.error('Error:', error); alert('Submission failed. Please try again.'); });
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
                thankYouMessage.classList.add('visible'); // Add class to trigger fade-in (defined in CSS)
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
