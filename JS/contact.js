// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Auto-Update Footer Year
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Form Submission Handler
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Simple validation
            if (!name || !email || !message) {
                showMessage("Please fill out all fields.", "error");
                return;
            }

            // Email validation
            if (!validateEmail(email)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            // Send data via fetch to PHP backend
            try {
                const response = await fetch("send_email.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ subject: `New Contact from ${name}`, message, email })
                });

                const result = await response.json();

                if (result.status === "success") {
                    showMessage("Message sent successfully!", "success");
                    contactForm.reset();
                } else {
                    showMessage("Error sending message. Please try again later.", "error");
                }
            } catch (error) {
                showMessage("Network error. Please check your connection.", "error");
            }
        });
    }

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Helper function to validate email
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Helper function to show messages
    function showMessage(msg, type) {
        if (formStatus) {
            formStatus.textContent = msg;
            formStatus.className = type;
            formStatus.classList.remove("hidden");

            // Hide after 3 seconds
            setTimeout(() => {
                formStatus.classList.add("hidden");
            }, 3000);
        }
    }
});