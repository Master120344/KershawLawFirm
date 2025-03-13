// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Auto-Update Footer Year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Form Submission Handler
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message) {
        formStatus.textContent = "Message sent successfully!";
        formStatus.classList.remove('hidden');
        formStatus.classList.add('success');

        // Reset form after 2 seconds
        setTimeout(() => {
            contactForm.reset();
            formStatus.classList.add('hidden');
        }, 2000);
    } else {
        formStatus.textContent = "Please fill out all fields.";
        formStatus.classList.remove('hidden');
        formStatus.classList.add('error');
    }
});

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});