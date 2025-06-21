# GCP Email Function Deployment Guide

This guide explains how to deploy and test the GCP email function using Gmail app password authentication.

---

## 1. Update `email-nm.js`
- Ensure `email-nm.js` uses `nodemailer.createTransport` and reads credentials from environment variables:
  - `GMAIL_USER`
  - `GMAIL_APP_PASSWORD`

## 2. Create `index.js` as the Cloud Function Entry Point
```js
// index.js
const { sendEmailWithAppPassword } = require('./email-nm.js');

exports.sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).send('Missing to, subject, or body');
  }
  try {
    await sendEmailWithAppPassword(to, subject, body);
    res.status(200).send('Email sent');
  } catch (err) {
    res.status(500).send('Failed to send email: ' + err.message);
  }
};
```

## 3. Deploy the Function
From the `gcp-agent-email2user` directory, run:

```bash
gcloud functions deploy sendEmail \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=sendEmail \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="GMAIL_USER=your@gmail.com,GMAIL_APP_PASSWORD=your_app_password"
```

Replace `your@gmail.com` and `your_app_password` with your actual values.

## 4. Get Function URL
After deployment, get the function URL:

```bash
gcloud functions describe sendEmail --region=us-central1 --format="value(serviceConfig.uri)"
```

## 5. Test the Deployed Function
Use `curl` to test the function:

```bash
curl -X POST https://sendemail-cs64iuly6q-uc.a.run.app \
  -H "Content-Type: application/json" \
  -d '{"to":"your@email.com","subject":"Test from Deployed Function","body":"This is a test email from the deployed GCP function!"}'
```

**Current Deployed Function URL:** `https://sendemail-cs64iuly6q-uc.a.run.app`

## 6. Integrate with LangGraph
- Set the function URL as `EMAIL_FUNCTION_URL` in your `.env` for the LangGraph project:
  ```
  EMAIL_FUNCTION_URL=https://sendemail-cs64iuly6q-uc.a.run.app
  ```
- Run your LangGraph workflow and confirm you receive emails as expected.

---

**Troubleshooting:**
- Ensure your Gmail account allows app password usage (2FA must be enabled).
- Check GCP logs for errors if the function fails.
- Make sure environment variables are set correctly in the deployment command. 