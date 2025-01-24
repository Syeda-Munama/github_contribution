const express = require('express');
const Contribution = require('../models/Contribution');
const router = express.Router();

// GitHub API call to fetch contributions
const getDailyContributions = async (username, accessToken) => {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - 1);

  const query = `
    query ($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
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
    }
  `;

  const variables = {
    username,
    from: fromDate.toISOString(),
    to: today.toISOString(),
  };

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user.contributionsCollection.contributionCalendar.weeks;
};

module.exports = getDailyContributions;

// Daily contribution route
router.post('/check', async (req, res) => {
  const { username, accessToken } = req.body;

  try {
    const weeks = await getDailyContributions(username, accessToken);
    const today = new Date().toISOString().split('T')[0];
    let hasContributed = false;

    for (const week of weeks) {
      for (const day of week.contributionDays) {
        if (day.date === today && day.contributionCount > 0) {
          hasContributed = true;
          break;
        }
      }
    }

    const contribution = new Contribution({
      username,
      date: today,
      hasContributed,
    });
    await contribution.save();

    res.status(200).json({ message: 'Check successful', hasContributed });
  } catch (error) {
    res.status(500).json({ message: 'Error checking contributions', error: error.message });
  }
});

module.exports = router;
