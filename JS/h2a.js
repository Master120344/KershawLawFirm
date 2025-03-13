// Smooth scroll to sections (reused for consistency)
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

// Hero section background animation
const heroSection = document.querySelector('.h2a-hero');
let hue = 0;
setInterval(() => {
    hue = (hue + 1) % 360;
    heroSection.style.background = `linear-gradient(120deg, hsl(${hue}, 70%, 40%), hsl(${(hue + 90) % 360}, 70%, 60%))`;
}, 50);

// Card hover animation
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transition = 'transform 0.3s ease-in-out';
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
    });

    card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = 'none';
    });
});

// Process steps reveal animation
const processSteps = document.querySelectorAll('.process li');
const revealSteps = entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('reveal');
            }, index * 200);
        }
    });
};

const processObserver = new IntersectionObserver(revealSteps, {
    threshold: 0.3
});

processSteps.forEach(step => processObserver.observe(step));

// Call-to-Action button pulse effect
const ctaButton = document.querySelector('.cta-button');
setInterval(() => {
    ctaButton.style.transition = 'all 0.3s ease-in-out';
    ctaButton.style.transform = 'scale(1.1)';
    setTimeout(() => {
        ctaButton.style.transform = 'scale(1)';
    }, 300);
}, 2000);

// Form error prevention if user tries to navigate away
window.addEventListener('beforeunload', e => {
    const formModified = document.querySelector('#name')?.value || document.querySelector('#email')?.value;
    if (formModified) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your changes might not be saved.';
    }
});

// Accessibility: Keyboard navigation for cards
document.querySelectorAll('.card').forEach((card, index, cards) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' && cards[index + 1]) cards[index + 1].focus();
        if (e.key === 'ArrowLeft' && cards[index - 1]) cards[index - 1].focus();
    });
});

// Lazy loading images (boosts performance)
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
});

// Performance tracking
window.addEventListener('load', () => {
    console.log('H-2A page loaded successfully.');
    const loadTime = performance.now() / 1000;
    console.log(`H-2A page loaded in ${loadTime.toFixed(2)} seconds.`);
});