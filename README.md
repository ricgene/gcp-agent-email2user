# GCP Agent Email Sender

## Overview
This is a Node.js application that sends and receives emails using either:
- Nodemailer with Gmail SMTP
- Gmail API with service account authentication

This is not a GCP Cloud Function (Gen1 or Gen2) or Firebase Function, but rather a standalone Node.js application.

## Environment
This application is designed to run in:
- Local development environment (evident from local file paths)
- Standard Node.js server/VM (Compute Engine or similar)
- Potentially containerized environments (though no Dockerfile is present)

## Components
- `email-nm.js`: Email sending implementation using Nodemailer and Gmail SMTP
- `index.js`: Contains functions for sending email via Gmail API
- `receive-email.js`: Contains functions for receiving and processing emails via Gmail API
- `test-mail.js`: Test script for the Gmail API implementation
- `.env-example`: Template for environment variables (Gmail credentials)
- `.gitignore`: Standard file to exclude sensitive information from git
- `package.json` & `package-lock.json`: Node.js project and dependency management

## Authentication Methods
1. **Nodemailer (SMTP)**: Uses Gmail app password stored in `.env` file
2. **Gmail API**: Uses service account key file (`prizmpoc-gmail-key.json`)

## Setup
1. Install dependencies:
   ```
   npm install
   ```
2. Create `.env` file from `.env-example` with your Gmail credentials
3. For Gmail API method, ensure you have a service account key file
4. For real-time email notifications, set up a Google Cloud Pub/Sub topic and add the topic name to your `.env` file as `PUBSUB_TOPIC`

## Usage
- For Nodemailer method:
  ```
  node email-nm.js
  ```
- For Gmail API method (sending):
  ```
  node test-mail.js
  ```
- For Gmail API method (receiving):
  ```
  node receive-email.js
  ```

## Features
### Sending Emails
- Send emails using Nodemailer with Gmail SMTP
- Send emails using Gmail API with service account authentication

### Receiving Emails
- List recent emails from your inbox
- Get detailed email content including headers and body
- Watch for new emails in real-time (requires Pub/Sub setup)
- Parse email content (subject, from, date, body)

## Notes
- This appears to be a proof-of-concept or utility script rather than a production service
- To deploy as a GCP Cloud Function, additional configuration would be required
- For real-time email notifications, you'll need to set up a Google Cloud Pub/Sub topic and configure the necessary permissions
