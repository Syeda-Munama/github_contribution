const axios = require('axios');


async function fetchGitHubEmail(accessToken) {
  try {
    const response = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the OAuth access token
      },
    });

    const emails = response.data; // GitHub returns an array of email objects
    const primaryEmail = emails.find(email => email.primary)?.email;

    return primaryEmail || 'No public email'; // Return primary email or fallback
  } catch (error) {
    console.error('Error fetching email from GitHub:', error.message);
    return 'No public email'; // Fallback in case of error
  }
}

module.exports = {
  fetchGitHubEmail,
};
