# GCP Agent Email Sender

## Overview
This is a Node.js application that sends emails using either:
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

## Usage
- For Nodemailer method:
  ```
  node email-nm.js
  ```
- For Gmail API method:
  ```
  node test-mail.js
  ```

## Notes
- This appears to be a proof-of-concept or utility script rather than a production service
- To deploy as a GCP Cloud Function, additional configuration would be required
