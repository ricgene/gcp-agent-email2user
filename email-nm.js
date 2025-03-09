//
// gmail tied to gcp sending out to users
// 
// npm init -y
// npm install googleapis nodemailer --save
// node test-email.js
//
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmailWithAppPassword() {
  // Create a transporter using Gmail and app password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
     user: process.env.GMAIL_USER,
     pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Send email
  //       from: `"Your Agent" <${process.env.GMAIL_USER}>`,
  try {
    const info = await transporter.sendMail({
      from: '"Pzizm Agent" foilboi80@gmail.com',
      to: 'richard.genet@gmail.com',
      subject: 'Test Email from Conversational Agent',
      text: 'This is a test email from my GCP conversational agent. https://cnn.com'
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Test the function
sendEmailWithAppPassword();