import passport from "../auth";

export const secure = passport.authenticate('jwt', { session: false })