// npm init -y
// npm install nodemailer dotenv --save
// node email-nm.js

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmailWithAppPassword(to, subject, body) {
  try {
    // Validate required parameters
    if (!to || !subject || !body) {
      throw new Error('Missing required parameters: to, subject, and body are required');
    }

    // Create transporter using Gmail app password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Send email with provided parameters
    const info = await transporter.sendMail({
      from: `"Prizm Agent" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      text: body
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Export the function for use in other modules
module.exports = { sendEmailWithAppPassword };

// Test function (for backward compatibility)
async function testEmail() {
  try {
    await sendEmailWithAppPassword(
      'richard.genet@gmail.com',
      'Test Email from Conversational Agent (App Password)',
      'This is a test email from my GCP conversational agent using Gmail app password. https://cnn.com'
    );
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Execute test if run directly
if (require.main === module) {
  testEmail();
}