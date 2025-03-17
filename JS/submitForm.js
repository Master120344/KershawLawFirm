document.getElementById('questionnaireForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        businessName: document.getElementById('businessName').value,
        tradeName: document.getElementById('tradeName').value,
        fein: document.getElementById('fein').value,
        naicsCode: document.getElementById('naicsCode').value,
        contactEmail: document.getElementById('contactEmail').value,
        // Add other fields similarly
    };

    // Generate a unique access code
    const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Save data to Firebase Firestore
    import { db } from './firebase.js';
    import { collection, addDoc } from "firebase/firestore";

    addDoc(collection(db, "questionnaires"), { ...formData, accessCode })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            alert(`Form submitted successfully! Your access code is: ${accessCode}`);

            // Send email with access code
            sendEmail(formData.contactEmail, accessCode);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
});

function sendEmail(email, accessCode) {
    // Implement email sending logic here
    // You can use a service like SendGrid, Mailgun, or a backend function to send the email
    console.log(`Sending email to ${email} with access code ${accessCode}`);
}
