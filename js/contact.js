// Form submission handling
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !service || !message) {
        alert("Please fill out all fields.");
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const ticketNumber = Math.floor(100000 + Math.random() * 900000);
    const thankYouMessage = document.getElementById("thankYouMessage");
    thankYouMessage.style.display = "block";
    thankYouMessage.innerHTML = `Thank you, ${name}! We’ll reach out soon. Your ticket number is: ${ticketNumber}`;

    console.log(`Form Submitted:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}\nTicket: ${ticketNumber}`);

    document.getElementById("contactForm").reset();

    if (window.innerWidth <= 768) {
        thankYouMessage.scrollIntoView({ behavior: "smooth" });
    }
});

// Smooth scroll for navigation
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
});

// Button hover animations
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('mouseover', () => {
    ctaButton.style.transform = 'translateY(-5px) scale(1.05)';
    ctaButton.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.5)';
});
ctaButton.addEventListener('mouseout', () => {
    ctaButton.style.transform = 'translateY(0) scale(1)';
    ctaButton.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
});

const loginButton = document.querySelector('.login-button');
loginButton.addEventListener('mouseover', () => {
    loginButton.style.transform = 'translateY(-3px)';
    loginButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
});
loginButton.addEventListener('mouseout', () => {
    loginButton.style.transform = 'translateY(0)';
    loginButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
});

// Section reveal animation
const sections = document.querySelectorAll('.section');
const revealSection = entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
};

const observer = new IntersectionObserver(revealSection, { threshold: 0.2 });
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.5s ease';
    observer.observe(section);
});

// Dynamic header shadow
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    }
});
