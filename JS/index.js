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
        // User is signed in
        loginButton.style.display = 'none';
        userInfo.style.display = 'flex';
        userEmail.textContent = user.email;
    } else {
        // User is signed out
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
            console.error('Logout error:', error);
            alert('Logout failed');
        });
});