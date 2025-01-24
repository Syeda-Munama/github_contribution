const express = require('express');
const Reminder = require('../models/Reminder');
const sendEmail = require('../config/sendEmail');
const router = express.Router();

router.post('/set-reminder', async (req, res) => {
  const { username, email, targetDate } = req.body;

  if (!email || !targetDate ) {
    return res.status(400).json({ error: 'Missing email or targetDate' });
  }

  try {
    const newReminder = new Reminder({ username, email, targetDate, isSent: false });
    await newReminder.save();
   

    // Attempt to send the email immediately
  const emailSent = await sendEmail(
    email,
    'Reminder Set',
    `Hi ${username}, your reminder has been set for ${targetDate}.`
  );

  // Update the isSent field based on success
  if (emailSent) {
    // newReminder.isSent = true;
    await newReminder.save();
    res.status(201).json({ message: 'Reminder set successfully' });
  }
  } catch (error) {
    res.status(500).json({ message: 'Error setting reminder', error: error.message });

  }
});

module.exports = router;
