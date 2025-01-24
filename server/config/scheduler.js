const cron = require('node-cron');
const sendEmail = require('./sendEmail');
const { tokenStore } = require('../routes/storeToken'); // Assuming tokenStore is still used
const Reminder = require('../models/Reminder'); // Your Reminder model
let fetch;

// Initialize the `fetch` function
(async () => {
  fetch = (await import('node-fetch')).default;
})();

async function startScheduler() {
  // Ensure `fetch` is initialized before starting the cron job
  if (!fetch) {
    fetch = (await import('node-fetch')).default;
  }

  // Run cron job every minute
  cron.schedule('* * * * *', async () => {
    console.log('Running contribution and reminder check...');

    try {
      // Fetch reminders where `isSent` is false
      const reminders = await Reminder.find({ isSent: false });

      const currentDateString = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
     console.log(currentDateString);
      for (const reminder of reminders) {
        const { username, email, targetDate, _id } = reminder;
        const targetDateString = new Date(targetDate).toISOString().split('T')[0];

        // Only proceed if the target date has arrived or passed
        if (currentDateString < targetDateString) {
          console.log(`Skipping reminder for ${username}, target date (${targetDateString}) hasn't arrived.`);
          continue;
        }

        // Retrieve token from tokenStore
        const tokenData = tokenStore.get(username);
        if (!tokenData) {
          console.error(`Token not found for username: ${username}`);
          continue;
        }
        const { token } = tokenData;

        try {
          // Fetch contributions data from GitHub API
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
            // Send email reminder for lack of contribution
            await sendEmail(
              email,
              'Contribution Reminder',
              `You have not contributed on your target date (${targetDateString}). Remember to make a contribution!`
            );
            console.log(`Reminder email sent to ${email}`);

            // Update the reminder as sent
            await Reminder.findByIdAndUpdate(_id, { isSent: true });
          } else {
            // Send email confirming contribution
            await sendEmail(
              email,
              'Contribution Confirmation',
              `You have successfully contributed on your target date (${targetDateString}). Great job!`
            );
            console.log(`Confirmation email sent to ${email}`);

            // Update the reminder as sent (optional, depending on your logic)
            await Reminder.findByIdAndUpdate(_id, { isSent: true });
          }
        } catch (error) {
          console.error(`Error checking contributions for ${username}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error fetching reminders from database:', error.message);
    }
  });
}

module.exports = startScheduler;
