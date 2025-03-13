// Smooth scroll for navigation links
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

// Mobile menu toggle
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
const yearSpan = document.getElementById('footer-year');
yearSpan.textContent = new Date().getFullYear();

// Header shrink on scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }
});

// Scroll reveal animations
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

// Smooth button hover effect with JS-based delay
const ctaButton = document.querySelectorAll('.cta-button');

ctaButton.forEach(button => {
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

// Dark mode toggle (Optional feature)
const darkModeToggle = document.createElement('button');
darkModeToggle.innerText = "🌙 Dark Mode";
darkModeToggle.classList.add('dark-mode-toggle');
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerText = document.body.classList.contains('dark-mode') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Easter egg: Lawyer joke popup (just for fun!)
const lawJoke = [
    "Why don't sharks attack lawyers? Professional courtesy.",
    "What do you get when you mix a bad lawyer with the Godfather? An offer you can't understand.",
    "What's the difference between a lawyer and a herd of buffalo? The lawyer charges more."
];

document.addEventListener('keydown', e => {
    if (e.key === 'L') {
        alert(lawJoke[Math.floor(Math.random() * lawJoke.length)]);
    }
});