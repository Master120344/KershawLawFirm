// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0'; // Start hidden
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100); // Slight delay for effect
});

// Firebase Authentication Logic (assumes Firebase is loaded externally)
const auth = window.auth; // Replace with your Firebase auth instance
const loginForm = document.getElementById('login-form');
const userInfo = document.getElementById('user-info');
const userEmail = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');
const loginMessage = document.getElementById('login-message');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginMessage.textContent = ''; // Clear previous message
    loginMessage.className = 'login-message'; // Reset classes

    window.signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Logged in:', user.email);
            loginMessage.textContent = 'Redirecting...';
            loginMessage.classList.add('success');
            setTimeout(() => {
                window.location.href = '/dashboard'; // Redirect to dashboard (adjust URL as needed)
            }, 1500); // 1.5-second delay for user to see message
        })
        .catch((error) => {
            console.error('Login error:', error.code, error.message);
            loginMessage.textContent = 'Invalid credentials';
            loginMessage.classList.add('error');
        });
});

// Monitor auth state changes
window.onAuthStateChanged(auth, (user) => {
    if (user) {
        loginForm.style.display = 'none';
        userInfo.style.display = 'block';
        userEmail.textContent = user.email;
    } else {
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
        input.parentElement.style.transform = 'translateY(-3px)';
    });
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});