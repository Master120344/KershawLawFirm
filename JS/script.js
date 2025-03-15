document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let service = document.getElementById("service").value;
    let message = document.getElementById("message").value;

    // Generate a random ticket number
    let ticketNumber = "KL-" + Math.floor(100000 + Math.random() * 900000);

    // Hide form and show thank-you message
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

    // Send data to send_email.php
    fetch("send_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: email, 
            subject: "New Inquiry - Ticket #" + ticketNumber,
            message: emailBody
        })
    }).then(response => response.json())
      .then(data => console.log("Email Status:", data))
      .catch(error => console.error("Error sending email:", error));
});