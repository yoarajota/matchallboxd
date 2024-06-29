import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "./models/Users";
import { Request } from "express";

// Interface para o payload do JWT
interface JwtPayload {
  id: number; // Ajuste conforme o tipo de ID do seu modelo
}

// Extrator de token do cookie
const cookieExtractor = function(req: Request): string | null {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// Opções de configuração para a estratégia JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: "TOP_SECRET",
};

// Estratégia JWT para autenticação baseada em token
passport.use(
  new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      console.log(user, jwt_payload)
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

// Estratégia Local para login do usuário
passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { username } });
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