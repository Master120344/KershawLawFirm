document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Grab form values
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let service = document.getElementById("service").value.trim();
    let message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !phone || !service || !message) {
        alert("Please fill out all fields.");
        return;
    }

    // Generate a random ticket number
    let ticketNumber = "KL-" + Math.floor(100000 + Math.random() * 900000);

    // Display thank-you message and hide the form
    document.getElementById("form-container").style.display = "none";
    document.getElementById("thank-you-message").style.display = "block";
    document.getElementById("user-name").textContent = name;
    document.getElementById("ticket-number").textContent = ticketNumber;

    // Prepare email content
    let emailBody = `
        New Contact Form Submission:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service Requested: ${service}
        Message: ${message}

        Ticket Number: ${ticketNumber}
    `;

    // Send data to PHP file
    fetch("php/send_email.php", {  // Correct path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: email,
            subject: `New Inquiry - Ticket #${ticketNumber}`,
            message: emailBody
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Email Status:", data);
        if (data.status !== "success") {
            alert("Failed to send the email. Please try again later.");
            document.getElementById("form-container").style.display = "block";
            document.getElementById("thank-you-message").style.display = "none";
        }
    })
    .catch(error => {
        console.error("Error sending email:", error);
        alert("There was an error sending your inquiry. Please try again.");
        document.getElementById("form-container").style.display = "block";
        document.getElementById("thank-you-message").style.display = "none";
    });
});
