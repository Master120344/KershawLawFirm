// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
});

// Firebase Auth Logic
const auth = window.auth;
const userInfo = document.getElementById('user-info');
const userEmail = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('login-button');

window.onAuthStateChanged(auth, (user) => {
    if (user) {
        loginButton.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = user.email;
    } else {
        loginButton.style.display = 'block';
        userInfo.style.display = 'none';
    }
});

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.signOut(auth)
        .then(() => {
            console.log('Logged out');
        })
        .catch((error) => {
            console.error('Logout error:', error.code, error.message);
            alert('Logout failed');
        });
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