import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js"; // Make sure path is correct
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/users/auth/google/callback", // Matches your route below
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // 2. If not, create a new user without a password
          user = new User({
            username: profile.displayName.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 1000), // Generate unique username
            email: profile.emails[0].value,
            fullName: profile.displayName,
            avatar: profile.photos[0].value,
            googleId: profile.id,
            // password: We leave this empty!
          });
          await user.save({ validateBeforeSave: false }); // Skip password validation
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);