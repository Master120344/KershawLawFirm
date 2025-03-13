// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Smooth Scroll Functionality for All Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Year Auto-Updater in Footer
const yearSpan = document.getElementById('footer-year');
yearSpan.textContent = new Date().getFullYear();

// Reveal Sections on Scroll (Fade-in Effect)
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    reveals.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = 150;
        if (sectionTop < windowHeight - revealPoint) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Back to Top Button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = "⬆";
backToTopBtn.id = 'backToTop';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Validation for Contact Page (If Needed Later)
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const message = document.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            e.preventDefault();
            alert('Please fill out all fields.');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            e.preventDefault();
            alert('Please enter a valid email.');
        }
    });
}

// Lazy Loading Images for Performance Boost
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.loading = "lazy";
});

// Light/Dark Mode Toggle (Extra Feature)
const darkModeToggle = document.createElement('button');
darkModeToggle.id = 'darkModeToggle';
darkModeToggle.innerText = "🌙 Dark Mode";
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerText = document.body.classList.contains('dark-mode') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Error Handling for Broken Links or Images
window.addEventListener('error', (e) => {
    console.error("Error detected: ", e);
});

// Performance Boosting Lazy Loading Video (Optional)
const videos = document.querySelectorAll('video');
videos.forEach(video => {
    video.preload = "none";
});