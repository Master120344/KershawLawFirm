document.getElementById('questionnaireForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        businessName: document.getElementById('businessName').value,
        tradeName: document.getElementById('tradeName').value,
        fein: document.getElementById('fein').value,
        naicsCode: document.getElementById('naicsCode').value,
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
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
});
