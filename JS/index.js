// Smooth scrolling for navigation links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 50,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle setup
const navMenu = document.querySelector('.nav-menu');
const menuToggle = document.createElement('div');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '☰';
document.querySelector('header').appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
});

// Dynamic footer year update
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Header shrink effect on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

// Section reveal animations on scroll
const sections = document.querySelectorAll('section');
const revealSection = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.2
});

sections.forEach(section => sectionObserver.observe(section));

// Auto-highlight active navigation link on scroll
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
            document.querySelector('.nav-menu a.active').classList.remove('active');
            link.classList.add('active');
        }
    });
});

// Button hover effect with dynamic scaling
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transition = 'all 0.3s ease-in-out';
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.8)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
    });
});

// Dark mode toggle button setup
const darkModeToggle = document.createElement('button');
darkModeToggle.innerText = "Dark Mode";
darkModeToggle.classList.add('dark-mode-toggle');
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerText = document.body.classList.contains('dark-mode') ? "Light Mode" : "Dark Mode";
});

// Back to top button functionality
const backToTopButton = document.createElement('button');
backToTopButton.innerText = "↑ Top";
backToTopButton.classList.add('back-to-top');
document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form validation setup
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const message = document.querySelector('#message').value.trim();
        const errorMsg = document.querySelector('.form-error');

        if (!name || !email || !message) {
            errorMsg.innerText = 'Please fill in all fields.';
            errorMsg.classList.add('visible');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMsg.innerText = 'Please enter a valid email address.';
            errorMsg.classList.add('visible');
            return;
        }

        errorMsg.classList.remove('visible');
        alert('Message sent successfully!');
        contactForm.reset();
    });
}

// Auto-collapse mobile menu after link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('open');
        }
    });
});

// Load performance tracker
window.addEventListener('load', () => {
    console.log('Website loaded successfully.');
    const loadTime = performance.now() / 1000;
    console.log(`Page loaded in ${loadTime.toFixed(2)} seconds.`);
});

// Error handler
window.onerror = (message, source, lineno, colno, error) => {
    console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
};

// Prevent accidental page reload or close with unsaved form data
window.addEventListener('beforeunload', e => {
    if (contactForm && contactForm.querySelector('#name').value !== "") {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your data might not be saved.';
    }
});