// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
});

// Firebase Authentication Logic
const auth = window.auth;
const loginForm = document.getElementById('login-form');
const userInfo = document.getElementById('user-info');
const userEmail = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    window.signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Logged in:', user.email);
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message);
            alert(`Login failed: ${error.message}`);
        });
});

// Monitor auth state changes
window.onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginForm.style.display = 'none';
        userInfo.style.display = 'block';
        userEmail.textContent = user.email;
    } else {
        // User is signed out
        loginForm.style.display = 'block';
        userInfo.style.display = 'none';
    }
});

// Handle logout
logoutButton.addEventListener('click', () => {
    window.signOut(auth)
        .then(() => {
            console.log('Logged out');
        })
        .catch((error) => {
            console.error('Logout error:', error);
            alert('Logout failed');
        });
});

// Form field animation
const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-5px)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});