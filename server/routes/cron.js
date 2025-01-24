const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const sendEmail = require('../config/sendEmail');
const { tokenStore } = require('./storeToken'); // Update the path accordingly
let fetch;

// Initialize `fetch`
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// API Endpoint to handle the cron job logic
router.get('/execute', async (req, res) => {
  try {
    console.log('Executing contribution and reminder check...');
    const reminders = await Reminder.find({ isSent: false });

    const currentDateString = new Date().toISOString().split('T')[0];

    for (const reminder of reminders) {
      const { username, email, targetDate, _id } = reminder;
      const targetDateString = new Date(targetDate).toISOString().split('T')[0];

      if (currentDateString < targetDateString) {
        console.log(`Skipping reminder for ${username}, target date (${targetDateString}) hasn't arrived.`);
        continue;
      }

      const tokenData = tokenStore.get(username);
      if (!tokenData) {
        console.error(`Token not found for username: ${username}`);
        continue;
      }

      const { token } = tokenData;

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
          query {
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }`,
        }),
      });

      const data = await response.json();

      if (!data || !data.data || !data.data.user) {
        throw new Error('Invalid data structure received from API.');
      }

      const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;

      let hasContributedOnTargetDate = false;
      weeks.forEach((week) =>
        week.contributionDays.forEach((day) => {
          if (day.date === targetDateString && day.contributionCount > 0) {
            hasContributedOnTargetDate = true;
          }
        })
      );

      if (!hasContributedOnTargetDate) {
        await sendEmail(
          email,
          'Contribution Reminder',
          `You have not contributed on your target date (${targetDateString}). Remember to make a contribution!`
        );
        console.log(`Reminder email sent to ${email}`);
        await Reminder.findByIdAndUpdate(_id, { isSent: true });
      } else {
        await sendEmail(
          email,
          'Contribution Confirmation',
          `You have successfully contributed on your target date (${targetDateString}). Great job!`
        );
        console.log(`Confirmation email sent to ${email}`);
        await Reminder.findByIdAndUpdate(_id, { isSent: true });
      }
    }

    res.status(200).json({ message: 'Cron job executed successfully.' });
  } catch (error) {
    console.error('Error executing cron job:', error.message);
    res.status(500).json({ message: 'Cron job failed.', error: error.message });
  }
});

module.exports = router;
