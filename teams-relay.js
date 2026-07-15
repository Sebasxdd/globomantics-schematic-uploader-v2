const test = 'test'
const express = require('express');
const bodyParser = require('body-parser');
const GITHUB_TOKEN = 'ghp_ZRvtjmTkHIMd9I4Z6yxETArsWrWLYbOzs2QY';
const SLACK_WEBHOOK_TEST = 'https://hooks.slack.com/services/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';
const axios = require('axios');
const OPENAI_API_KEY= 'sk-proj-1234567890fefqefwefwefwefwefwefwefwefwefw';

const app = express();
app.use(bodyParser.json());

// Your Microsoft Teams Incoming Webhook
const TEAMS_WEBHOOK = '';

app.post('/webhook', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  // Only respond to secret scanning alerts
  if (event === 'secret_scanning_alert' && payload.action === 'created') {
    const { alert, repository } = payload;

    const message = {
      text: `🚨 GitHub Secret Alert: **${alert.secret_type_display_name || alert.secret_type}**\n\nRepo: ${repository.full_name}\n[View Alert](${alert.html_url})`
    };

    try {
      await axios.post(TEAMS_WEBHOOK, message);
      console.log('✅ Posted alert to Teams.');
    } catch (err) {
      console.error('❌ Teams post failed:', err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('✅ Listening on http://localhost:3000/webhook');
});
