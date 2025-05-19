// npm init -y
// npm install googleapis nodemailer dotenv --save
// node email-oauth.js

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

async function sendEmailWithOAuth2() {
  try {
    // Create OAuth2 client
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URL
    );

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });

    // Get access token
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error('Error getting access token:', err);
          reject(err);
        }
        resolve(token);
      });
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Pzizm Agent" <${process.env.GMAIL_USER}>`,
      to: 'richard.genet@gmail.com',
      subject: 'Test Email from Conversational Agent (OAuth2)',
      text: 'This is a test email from my GCP conversational agent using OAuth2. https://cnn.com'
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Execute the function
sendEmailWithOAuth2().catch(console.error);