import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import config from './config';
import User from '@/models/user.model';
import Role from '@/models/role.model';
import { IUser } from '@/interfaces/user.interface';

const googleStrategy = new GoogleStrategy(
  {
    clientID: config.google.clientID!,
    clientSecret: config.google.clientSecret!,
    callbackURL: config.google.callbackURL!,
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: IUser | false) => void) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('Google account does not have an email.'), false);
      }

      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // If user doesn't exist with googleId, check if they exist with the email
        user = await User.findOne({ email });

        if (user) {
          // If they exist with email but not googleId, it means they signed up locally.
          // Link the account.
          user.googleId = profile.id;
          user.authProvider = 'google';
        } else {
          // If user does not exist at all, create a new one.
          const defaultRole = await Role.findOne({ name: 'USER' });
          user = new User({
            googleId: profile.id,
            email: email,
            username: profile.displayName.replace(/\\s/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
            fullName: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            isEmailVerified: true,
            authProvider: 'google',
            roles: defaultRole ? [defaultRole._id] : [],
          });
        }
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

passport.use(googleStrategy);

export default passport; 