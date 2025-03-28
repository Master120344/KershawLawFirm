// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
});

// Prescreen form submission
document.getElementById('prescreen-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const clientStatus = document.getElementById('client-status').value;

    if (clientStatus === 'yes') {
        localStorage.setItem('authenticated', 'true');
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    } else {
        alert('Sorry, this site is for clients or potential clients only.');
    }
});