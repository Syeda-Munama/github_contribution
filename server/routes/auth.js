
// const express = require('express');
// const passport = require('passport');
// const router = express.Router();

// // GitHub OAuth route
// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// router.get(
//   '/github/callback',
//   passport.authenticate('github', { failureRedirect: '/' }),
//   (req, res) => {
//     const { username, accessToken, email } = req.user;
//     // Append username and token as query parameters
//     res.redirect(`http://localhost:5173/dashboard?username=${username}&token=${accessToken}&email=${email}`);
//   }
// );


// // Route to get the current logged-in user's session data
// router.get('/user', (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   res.json(req.session.user);
// });

// // Route to sign out and destroy the session
// router.get('/github/signout', (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error('Error during logout:', err);
//       return res.status(500).json({ message: 'Failed to log out' });
//     }
//     req.session.destroy((sessionErr) => {
//       if (sessionErr) {
//         console.error('Error destroying session:', sessionErr);
//         return res.status(500).json({ message: 'Failed to clear session' });
//       }
//       res.clearCookie('connect.sid'); // Clear session cookie
//       res.status(200).json({ message: 'Successfully signed out' });
//     });
//   });
// });

// module.exports = router;
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Get Frontend URL from Environment Variable
const FRONTEND_URL = process.env.FRONTEND_URL

// GitHub OAuth route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const { username, accessToken, email } = req.user;
    // Append username and token as query parameters
    res.redirect(`${FRONTEND_URL}/dashboard?username=${username}&token=${accessToken}&email=${email}`);
  }
);

// Route to get the current logged-in user's session data
router.get('/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json(req.session.user);
});

// Route to sign out and destroy the session
router.get('/github/signout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Failed to log out' });
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Error destroying session:', sessionErr);
        return res.status(500).json({ message: 'Failed to clear session' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Successfully signed out' });
    });
  });
});

module.exports = router;
