// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Add 'loaded' class to body for CSS fade-in transition
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // --- Firebase Authentication Logic ---

    // Access Firebase functions made available on the window object from the HTML script tag
    const auth = window.firebaseAuth;
    const onAuthStateChanged = window.firebaseOnAuthStateChanged;
    const signOut = window.firebaseSignOut;

    // Get references to DOM elements
    const userInfo = document.getElementById('user-info');
    const userEmail = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button'); // Ensure this ID exists in HTML

    if (!auth || !onAuthStateChanged || !signOut || !userInfo || !userEmail || !logoutButton || !loginButton) {
        console.error("Firebase auth or DOM elements not found. Check HTML and Firebase setup.");
        return; // Stop execution if essential parts are missing
    }

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            console.log("User signed in:", user.email);
            if (loginButton) loginButton.style.display = 'none'; // Hide login button
            if (userInfo) userInfo.style.display = 'flex';       // Show user info
            if (userEmail) userEmail.textContent = user.email;   // Display user email

        } else {
            // User is signed out
            console.log("User signed out.");
            if (loginButton) loginButton.style.display = 'flex'; // Show login button (use flex as it's likely in a flex container)
            if (userInfo) userInfo.style.display = 'none';        // Hide user info
            if (userEmail) userEmail.textContent = '';           // Clear user email display
        }
    });

    // Add event listener for the logout button
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        signOut(auth)
            .then(() => {
                console.log('User successfully logged out.');
                // Optional: Redirect to homepage or login page after logout
                // window.location.href = '/';
            })
            .catch((error) => {
                console.error('Logout error:', error);
                // Inform the user about the error
                alert('Logout failed. Please try again.');
            });
    });

}); // End of DOMContentLoaded listener