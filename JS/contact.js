// Form submission handling
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !phone || !service || !message) {
        alert("Please fill out all fields.");
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Generate ticket number
    const ticketNumber = Math.floor(100000 + Math.random() * 900000);

    // Display thank you message
    const thankYouMessage = document.getElementById("thankYouMessage");
    thankYouMessage.style.display = "block";
    thankYouMessage.innerHTML = `Thank you, ${name}! We will reach out to you shortly. Your ticket number is: ${ticketNumber}`;

    // Log for debugging
    console.log(`Form Submitted:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}\nTicket: ${ticketNumber}`);

    // Reset form
    document.getElementById("contactForm").reset();

    // Scroll to thank you message on mobile
    if (window.innerWidth <= 768) {
        thankYouMessage.scrollIntoView({ behavior: "smooth" });
    }
});

// Form field focus enhancements
const inputs = document.querySelectorAll(".contact-form input, .contact-form select, .contact-form textarea");
inputs.forEach(input => {
    input.addEventListener("focus", () => {
        input.style.background = "#FDFDFD";
    });
    input.addEventListener("blur", () => {
        input.style.background = "#FFFFFF";
    });
});

// Submit button hover effect for mobile touch
const submitBtn = document.querySelector(".submit-btn");
submitBtn.addEventListener("touchstart", () => {
    submitBtn.style.background = "#9B2D23";
}, { passive: true });
submitBtn.addEventListener("touchend", () => {
    submitBtn.style.background = "#C0392B";
}, { passive: true });