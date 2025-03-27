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
    ctaButton.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.6)';
});
ctaButton.addEventListener('mouseout', () => {
    ctaButton.style.transform = 'translateY(0) scale(1)';
    ctaButton.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5)';
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

// Dynamic header shadow based on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        header.style.background = 'rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'transparent';
    }
});

// Hero content hover enhancement
const heroContent = document.querySelector('.hero-content');
heroContent.addEventListener('mouseover', () => {
    heroContent.style.transform = 'translateY(-5px)';
});
heroContent.addEventListener('mouseout', () => {
    heroContent.style.transform = 'translateY(0)';
});

// Additional JS for consistency
window.addEventListener('resize', () => {
    const headerLine = document.querySelector('.header-line');
    headerLine.style.transition = 'width 0.4s ease';
});
