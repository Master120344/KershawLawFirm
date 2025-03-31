const express = require('express');
const nodemailer = require('nodemailer');
const { PDFDocument } = require('pdf-lib');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Firebase Admin Setup
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com'
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

app.post('/submit-questionnaire', async (req, res) => {
  const data = req.body;

  // Generate PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText(JSON.stringify(data), { x: 50, y: 350, size: 12 });
  const pdfBytes = await pdfDoc.save();

  // Save PDF to Firebase Storage
  const bucket = admin.storage().bucket();
  const file = bucket.file('questionnaires/questionnaire.pdf');
  await file.save(pdfBytes);

  // Send email with PDF link
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'admin-email@example.com',
    subject: 'New Questionnaire Submission',
    text: 'A new questionnaire has been submitted.',
    attachments: [
      {
        filename: 'questionnaire.pdf',
        content: pdfBytes
      }
    ]
  };

  await transporter.sendMail(mailOptions);

  res.status(200).send('Questionnaire submitted successfully.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
