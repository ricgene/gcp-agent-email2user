const {google} = require('googleapis');
const gmail = google.gmail('v1');

// A simplified version of the authentication (for testing only)
async function getTestAuth() {
  // You'll need to set up authentication credentials
  // For testing, you might use a service account key file
  const auth = new google.auth.GoogleAuth({
    keyFile: '/home/rgenet/prizmpoc-gmail-key.json',
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
  });
  return auth.getClient();
}

// Your email sending function from step 2
async function sendEmail(auth, to, subject, messageText) {
    // Create the email content
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      messageText,
    ];
    const message = messageParts.join('\n');
    
    // Encode the message as base64
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    // Send the email
    try {
      const res = await gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
      console.log('Email sent:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
}

// Test function
async function runTest() {
  try {
    const auth = await getTestAuth();
    await sendEmail(
      auth,
      'your-test-email@example.com',
      'Test Email from GCP Agent',
      'This is a test email from my GCP conversational agent.'
    );
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
runTest();