document.addEventListener('DOMContentLoaded', () => {
    // Element Selectors
    const bodyElement = document.body;
    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const userNameSpan = document.getElementById('user-name');
    const messageTextarea = document.getElementById('message');
    const charCountDisplay = document.getElementById('message-char-count');

    // Fade-in Effect for Page Load
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
        }, 50);
    }

    // Character Count for Message
    if (messageTextarea && charCountDisplay) {
        const maxChars = 5000;
        messageTextarea.addEventListener('input', () => {
            const currentLength = messageTextarea.value.length;
            if (currentLength <= maxChars) {
                charCountDisplay.textContent = `${currentLength}/${maxChars}`;
            } else {
                messageTextarea.value = messageTextarea.value.slice(0, maxChars);
                charCountDisplay.textContent = `${maxChars}/${maxChars}`;
            }
        });
    }

    // Contact Form Submission Handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page refresh

            // Collect form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                service: formData.get('service'),
                message: formData.get('message') || 'No message provided',
                submittedAt: new Date().toISOString()
            };

            // Simulate saving data and sending email
            console.log("Saving contact inquiry data:", data);
            console.log("Triggering email to blatent4464@gmail.com with details:", {
                to: "blatent4464@gmail.com",
                subject: `New Contact Inquiry: ${data.service}`,
                body: `
                    Name: ${data.name}
                    Email: ${data.email}
                    Phone: ${data.phone}
                    Service Needed: ${data.service}
                    Message: ${data.message}
                    Submitted: ${data.submittedAt}
                `
            });

            // Update Thank You message with user's name
            userNameSpan.textContent = data.name;

            // Transition to Thank You Message
            contactForm.style.transition = 'opacity 0.3s ease';
            contactForm.style.opacity = '0';
            setTimeout(() => {
                contactForm.style.display = 'none';
                thankYouMessage.style.display = 'block';
                thankYouMessage.style.opacity = '0';
                setTimeout(() => {
                    thankYouMessage.style.transition = 'opacity 0.5s ease-in-out';
                    thankYouMessage.style.opacity = '1';
                    thankYouMessage.classList.add('visible');
                }, 50);
            }, 300);
        });
    } else {
        console.error("Contact form not found. Check ID 'contact-form'.");
    }

    // Enhance touch responsiveness
    document.querySelectorAll('.tab-link, .submit-button, .login-button').forEach(el => {
        el.addEventListener('touchstart', () => {}, { passive: true });
    });
});