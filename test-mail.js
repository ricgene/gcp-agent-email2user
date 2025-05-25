const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using Gmail SMTP
async function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  return transporter;
}

// Test function
async function runTest() {
  try {
    // Get recipient email from command line argument or use default
    const recipientEmail = process.argv[2] || process.env.TEST_EMAIL || 'your-test-email@example.com';
    
    const transporter = await createTransporter();
    
    // Send email
    const info = await transporter.sendMail({
      from: `"GCP Agent" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Test Email from GCP Agent',
      text: 'This is a test email from my GCP conversational agent.\n\n' +
            'If you received this email, the email sending functionality is working correctly!\n\n' +
            'Sent at: ' + new Date().toISOString()
    });

    console.log('Test email sent successfully to:', recipientEmail);
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
runTest();