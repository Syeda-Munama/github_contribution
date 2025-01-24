// // config/passport.js
// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;
// const User = require('../models/User'); // User schema

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,        // Set in .env
//       clientSecret: process.env.GITHUB_CLIENT_SECRET, // Set in .env
//       callbackURL: 'http://localhost:5000/auth/github/callback', // Adjust for production
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user exists in DB
//         let user = await User.findOne({ githubId: profile.id });

//         if (!user) {
//           // If not, create a new user
//           user = await User.create({
//             githubId: profile.id,
//             username: profile.username,
//             email: profile.emails[0].value, // Check if profile has email access
//             githubAccessToken: accessToken,
//           });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

// // Serialize and deserialize user for session support (if using sessions)
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// module.exports = passport;

const { fetchGitHubEmail } = require('./getEmail');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User'); // Replace with your user model

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Handle user authentication
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          // Fetch email if not in profile
          const primaryEmail = await fetchGitHubEmail(accessToken);
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            email: primaryEmail,
          });
        }

        // Attach accessToken to the user object
        user.accessToken = accessToken;

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  const sessionUser = { id: user.id, accessToken: user.accessToken }; // Include accessToken in session
  done(null, sessionUser);
});

// Deserialize user from session
passport.deserializeUser(async (sessionUser, done) => {
  try {
    const user = await User.findById(sessionUser.id);
    // Reattach accessToken for subsequent use
    if (user) {
      user.accessToken = sessionUser.accessToken;
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
