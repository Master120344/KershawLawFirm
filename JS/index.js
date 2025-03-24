// Smooth scroll for navigation
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Remove active class from all links
        document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        // Only scroll if not navigating to another page
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Add fade out transition before page change
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

// Button hover animation
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('mouseover', () => {
    ctaButton.style.transform = 'translateY(-5px) scale(1.05)';
});
ctaButton.addEventListener('mouseout', () => {
    ctaButton.style.transform = 'translateY(0) scale(1)';
});

// Dynamic header shadow based on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = 'none';
    }
});
