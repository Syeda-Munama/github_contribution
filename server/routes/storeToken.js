
const express = require('express');
const router = express.Router();

// In-memory token store
const tokenStore = new Map(); // username => { token, email }

// Endpoint to store the token
router.post('/store-token', (req, res) => {
  const { username, token, email } = req.body;

  if (!username || !token || !email) {
    return res.status(400).json({ success: false, error: 'Missing username, token, or email' });
  }

  // Store token and email in memory
  tokenStore.set(username, { token, email });
  console.log(`Stored token for ${username}: ${token} with email ${email}`);
  return res.json({ success: true });
});

// Endpoint to retrieve all tokens
router.get('/get-tokens', (req, res) => {
  res.json(Object.fromEntries(tokenStore)); // Convert Map to object
});

// Export `router` and `tokenStore` separately
module.exports = router;
module.exports.tokenStore = tokenStore;

