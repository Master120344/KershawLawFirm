document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    // Generate a random ticket number
    let ticketNumber = "KL-" + Math.floor(100000 + Math.random() * 900000);

    // Hide form and show thank-you message
    document.getElementById("form-container").style.display = "none";
    document.getElementById("thank-you-message").style.display = "block";
    document.getElementById("user-name").textContent = name;
    document.getElementById("ticket-number").textContent = ticketNumber;

    // Send email confirmation
    sendEmail(name, email, ticketNumber);
});

function sendEmail(name, email, ticketNumber) {
    let emailBody = `
        Hello ${name},

        Thank you for reaching out to The Kershaw Law Firm P.C.

        Your inquiry has been received, and your ticket number is ${ticketNumber}.
        We will get back to you shortly.

        Best Regards,
        The Kershaw Law Firm P.C.
    `;

    fetch("send_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: email,
            subject: "Your Inquiry Received - Ticket #" + ticketNumber,
            message: emailBody
        })
    }).then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error("Error sending email:", error));
}