const nodemailer = require('nodemailer');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

// Debug: Check if environment variables are loaded
console.log('Gmail User:', process.env.GMAIL_USER);
console.log('App Password length:', process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0);

// Create a transporter for sending emails
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

// Create an IMAP connection for receiving emails
function createImapConnection() {
  const imapConfig = {
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_APP_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  };

  return new Imap(imapConfig);
}

// Function to send an email
async function sendEmail(to, subject, text) {
  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"GCP Agent" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to check for new emails
function checkEmails(onNewEmail) {
  const imap = createImapConnection();

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) throw err;
      
      // Use today's date in DD-MMM-YYYY format for SINCE, no zero-padding for day
      const today = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const day = today.getDate(); // No zero-padding
      const month = months[today.getMonth()];
      const year = today.getFullYear();
      const imapDate = `${day}-${month}-${year}`;
      console.log('IMAP search date:', imapDate);
      imap.search(['UNSEEN', ['SINCE', imapDate]], (err, results) => {
        if (err) throw err;
        
        if (results.length === 0) {
          console.log('No new emails');
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: '' });
        
        fetch.on('message', (msg) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) throw err;
              
              // Process the email
              const email = {
                from: parsed.from.text,
                to: parsed.to.text,
                subject: parsed.subject,
                text: parsed.text,
                html: parsed.html,
                date: parsed.date
              };

              // Call the callback with the new email
              if (onNewEmail) {
                await onNewEmail(email);
              }

              console.log('New email received:', {
                from: email.from,
                subject: email.subject,
                date: email.date
              });
            });
          });
        });

        fetch.once('error', (err) => {
          console.error('Fetch error:', err);
        });

        fetch.once('end', () => {
          console.log('Done fetching all messages');
          imap.end();
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP error:', err);
  });

  imap.once('end', () => {
    console.log('IMAP connection ended');
  });

  imap.connect();
}

// Function to start watching for new emails
function startWatchingEmails(onNewEmail) {
  console.log('Starting to watch for new emails...');
  
  // Check immediately
  checkEmails(onNewEmail);
  
  // Then check every 5 minutes
  const interval = setInterval(() => {
    checkEmails(onNewEmail);
  }, 5 * 60 * 1000);
  
  // Return function to stop watching
  return () => {
    clearInterval(interval);
    console.log('Stopped watching for new emails');
  };
}

// Example usage
async function main() {
  try {
    // Send a single test email
    await sendEmail(
      'richard.genet@gmail.com',
      'Single Test Email from GCP Agent',
      'This is a single test email from my GCP conversational agent.\n\n' +
      'If you received this email, the email sending functionality is working correctly!\n\n' +
      'Sent at: ' + new Date().toISOString()
    );
    
    console.log('Test email sent successfully. Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main();
}

module.exports = {
  sendEmail,
  checkEmails,
  startWatchingEmails
}; 