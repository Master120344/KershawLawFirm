document.getElementById("contact-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Grab form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !phone || !service || !message) {
        alert("Please fill out all fields.");
        return;
    }

    // Generate a random ticket number
    const ticketNumber = `KL-${Math.floor(100000 + Math.random() * 900000)}`;

    // Show loading state
    const submitButton = document.querySelector(".submit-btn");
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true;

    // Display thank-you message and hide the form
    document.getElementById("form-container").style.display = "none";
    const thankYouMessage = document.getElementById("thank-you-message");
    thankYouMessage.style.display = "block";
    document.getElementById("user-name").textContent = name;
    document.getElementById("ticket-number").textContent = ticketNumber;

    // Prepare email content
    const emailBody = `
        New Contact Form Submission:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service Requested: ${service}
        Message: ${message}

        Ticket Number: ${ticketNumber}
    `;

    try {
        // Send data to PHP file
        const response = await fetch("php/send_email.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: email,
                subject: `New Inquiry - Ticket #${ticketNumber}`,
                message: emailBody
            })
        });

        const data = await response.json();

        if (data.status !== "success") {
            throw new Error("Failed to send the email. Please try again later.");
        }

        console.log("Email Status:", data);

    } catch (error) {
        console.error("Error sending email:", error);

        // Restore form on error
        alert("There was an error sending your inquiry. Please try again.");
        document.getElementById("form-container").style.display = "block";
        thankYouMessage.style.display = "none";
    } finally {
        // Reset button
        submitButton.textContent = "Submit Inquiry";
        submitButton.disabled = false;
    }
});
