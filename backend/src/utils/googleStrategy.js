import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js"; 
import dotenv from "dotenv";

dotenv.config();

// --- THE FIX IS HERE ---
// We check if we are in production. If yes, we force the full HTTPS link.
const callbackURL = process.env.NODE_ENV === "production" 
  ? "https://wandercallbackend.onrender.com/api/v1/users/auth/google/callback" 
  : "http://localhost:8000/api/v1/users/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL, // <--- We use the variable we defined above
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            username: profile.displayName.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 1000),
            email: profile.emails[0].value,
            name: profile.displayName, // Note: your schema uses 'name', profile has 'displayName'
            // avatar: profile.photos[0].value, // Only add this if your Schema has an avatar field!
            googleId: profile.id,
          });
          await user.save({ validateBeforeSave: false });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);