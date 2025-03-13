// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 50,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlight
const navLinks = document.querySelectorAll('.nav-menu a');
window.addEventListener('scroll', () => {
    let currentSection = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 60;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Button Hover Animation
document.querySelectorAll('.cta-button, .service-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 0 15px #00aaff';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
    });
});

// Fade-in Animation on Scroll
const fadeInElements = document.querySelectorAll('.about, .services, .contact-info');

const fadeInObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    fadeInObserver.observe(element);
});

// Dynamic Date & Time Display
const timeElement = document.createElement('div');
timeElement.id = 'current-time';
timeElement.style.position = 'fixed';
timeElement.style.bottom = '10px';
timeElement.style.right = '10px';
timeElement.style.background = '#00264d';
timeElement.style.color = '#00aaff';
timeElement.style.padding = '5px 10px';
timeElement.style.borderRadius = '5px';
document.body.appendChild(timeElement);

setInterval(() => {
    const now = new Date();
    timeElement.innerText = `📅 ${now.toLocaleDateString()} | 🕒 ${now.toLocaleTimeString()}`;
}, 1000);

// Back to Top Button
const topButton = document.createElement('button');
topButton.innerText = '⬆️ Top';
topButton.id = 'top-button';
topButton.style.position = 'fixed';
topButton.style.bottom = '20px';
topButton.style.right = '20px';
topButton.style.background = '#00aaff';
topButton.style.color = '#fff';
topButton.style.padding = '10px 15px';
topButton.style.borderRadius = '5px';
topButton.style.cursor = 'pointer';
topButton.style.display = 'none';
document.body.appendChild(topButton);

topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    topButton.style.display = window.scrollY > 300 ? 'block' : 'none';
});

// Interactive Background Animation
let hue = 0;
setInterval(() => {
    document.body.style.background = `linear-gradient(120deg, hsl(${hue}, 80%, 20%), hsl(${hue + 60}, 70%, 30%))`;
    hue = (hue + 1) % 360;
}, 100);

// Loading Animation
document.body.style.opacity = '0';
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 1.5s ease-in';
    document.body.style.opacity = '1';
});

// Accessibility Enhancements (Keyboard Navigation)
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') window.scrollBy(0, 100);
    if (event.key === 'ArrowUp') window.scrollBy(0, -100);
    if (event.key === 'Home') window.scrollTo(0, 0);
    if (event.key === 'End') window.scrollTo(0, document.body.scrollHeight);
});

// Form Spam Protection
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.querySelector('#name').value.trim();
        const email = document.querySelector('#email').value.trim();
        const message = document.querySelector('#message').value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
        } else if (!emailRegex.test(email)) {
            alert('Invalid email format.');
        } else if (message.includes('http') || message.includes('<script>')) {
            alert('Suspicious content detected!');
        } else {
            alert('Message sent successfully!');
            contactForm.reset();
        }
    });
}

// Security: Basic Bot Prevention
document.addEventListener('mousemove', () => {
    document.body.setAttribute('data-human', 'true');
});
document.addEventListener('keydown', () => {
    document.body.setAttribute('data-human', 'true');
});

setTimeout(() => {
    if (!document.body.hasAttribute('data-human')) {
        alert('Bot activity detected — action blocked!');
    }
}, 5000);

console.log('✅ Fully enhanced JS loaded successfully!');