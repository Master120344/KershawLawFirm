// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth Scroll for Links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Footer Year Auto-Updater
const yearSpan = document.getElementById('footer-year');
yearSpan.textContent = new Date().getFullYear();

// Section Reveal Animations on Scroll
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
    reveals.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight * 0.85) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
});

// Back to Top Button
const backToTop = document.createElement('button');
backToTop.id = 'backToTop';
backToTop.innerText = "⬆ Back to Top";
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 500 ? "block" : "none";
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Error Handling for Broken Links or Images
window.addEventListener('error', (e) => {
    console.error("Error detected:", e.message);
});