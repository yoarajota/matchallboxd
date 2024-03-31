import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import User from "./models/Users"; // Import your User model and UserDocument type
import { IUser } from "./types";

// Interface for payload in JWT token
interface JwtPayload {
  _id: string;
}

const cookieExtractor = function (req) {
  let token = null;

  if (req && req.cookies) token = req.cookies["access_token"];

  return token;
};

// Configuration options for JWT strategy
const opts: any = {}; // Change any to proper type
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = "TOP_SECRET";

// JWT Strategy for token-based authentication
passport.use(
  new JwtStrategy(opts, async function (jwt_payload: JwtPayload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload._id });

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

// Local Strategy for user signin
passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username: string, password: string, done) => {
      try {
        const user: IUser = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
