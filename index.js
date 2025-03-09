const {google} = require('googleapis');
const gmail = google.gmail('v1');

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