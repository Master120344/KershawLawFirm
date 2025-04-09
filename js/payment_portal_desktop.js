// js/payment_portal_desktop.js

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const userInfoDiv = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    const bodyElement = document.body;
    const paymentForm = document.getElementById('payment-portal-form');
    const paymentSection = document.getElementById('payment-form');
    const successSection = document.getElementById('payment-success');
    const confirmationEmail = document.getElementById('confirmation-email');

    // Fade-in Effect
    if (bodyElement) {
        setTimeout(() => {
            bodyElement.classList.add('loaded');
            console.log("Body 'loaded' class added for fade-in.");
        }, 50);
    } else {
        console.error("Body element not found.");
    }

    // Firebase Auth Setup
    if (window.firebaseAuth && window.firebaseOnAuthStateChanged && window.firebaseSignOut) {
        const auth = window.firebaseAuth;

        window.firebaseOnAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.email);
                if (loginButton) loginButton.style.display = 'none';
                if (userInfoDiv) userInfoDiv.style.display = 'flex';
                if (userEmailSpan) userEmailSpan.textContent = user.email;
                if (confirmationEmail) confirmationEmail.textContent = user.email;
            } else {
                console.log("User logged out, redirecting to login.");
                if (loginButton) loginButton.style.display = 'inline-block';
                if (userInfoDiv) userInfoDiv.style.display = 'none';
                if (userEmailSpan) userEmailSpan.textContent = 'test@gmail.com';
                window.location.href = '/KershawLawFirm/login_desktop.html';
            }
        });

        if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Logout clicked.");
                window.firebaseSignOut(auth)
                    .then(() => {
                        console.log("Sign out successful.");
                        window.location.href = '/KershawLawFirm/login_desktop.html';
                    })
                    .catch((error) => {
                        console.error("Logout failed:", error);
                        alert("Logout failed. Please try again.");
                    });
            });
            logoutButton.setAttribute('data-listener-attached', 'true');
        }
    } else {
        console.error("Firebase Auth not initialized.");
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    // Payment Form Submission (Demo)
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(paymentForm);
            const paymentData = {
                visaType: formData.get('visa-type'),
                cardNumber: formData.get('card-number'),
                expiryDate: formData.get('expiry-date'),
                cvv: formData.get('cvv'),
                cardholderName: formData.get('cardholder-name'),
                amount: 4000,
                timestamp: new Date().toISOString()
            };

            // Mock Payment API Call
            console.log("Processing payment:", paymentData);
            console.log("Demo Payment API Request:", {
                endpoint: "https://mock-payment-api.com/charge",
                method: "POST",
                body: {
                    amount: paymentData.amount,
                    currency: "USD",
                    card: {
                        number: paymentData.cardNumber,
                        exp: paymentData.expiryDate,
                        cvv: paymentData.cvv,
                        name: paymentData.cardholderName
                    },
                    description: `${paymentData.visaType.toUpperCase()} Visa Service Fee`
                }
            });

            // Simulate success
            setTimeout(() => {
                paymentSection.style.display = 'none';
                successSection.style.display = 'block';
                setTimeout(() => {
                    successSection.classList.add('visible');
                }, 50);
                alert("Demo Payment Successful! $4,000 charged (this is a simulation).");
            }, 1000); // Simulate network delay

            // Real implementation would use Stripe/PayPal API, e.g.:
            // stripe.createToken(cardElement).then(result => { ... });
        });
    }

    console.log("Payment Portal Desktop JS Initialized.");
});