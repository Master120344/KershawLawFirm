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

// Card hover animation
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
    });
    card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    });
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

// CTA button pulse
const ctaButton = document.querySelector('.cta-button');
setInterval(() => {
    ctaButton.style.transform = 'scale(1.05)';
    setTimeout(() => {
        ctaButton.style.transform = 'scale(1)';
    }, 300);
}, 2000);

// Video play state
const videoIframe = document.querySelector('.video-container iframe');
if (videoIframe) {
    videoIframe.addEventListener('load', () => {
        console.log('Video loaded successfully');
    });
}

// Performance tracking
window.addEventListener('load', () => {
    const loadTime = performance.now() / 1000;
    console.log(`H-2A page loaded in ${loadTime.toFixed(2)} seconds`);
});
