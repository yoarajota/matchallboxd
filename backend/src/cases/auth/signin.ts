import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../../types";
import passport from "../../auth";

const Sign = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    "Sign",
    async (err: Error, user: IUser | false, info: any) => {
      try {
        if (err) {
          return next(err); // Encaminha para o próximo middleware de erro
        }
        if (!user) {
          return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Autenticação bem-sucedida
        req.Sign(user, { session: false }, async (error: Error) => {
          if (error) {
            return next(error); // Encaminha para o próximo middleware de erro
          }

          const token = generateToken(user);
          return res.json({ token });
        });
      } catch (error) {
        return next(error); // Encaminha para o próximo middleware de erro
      }
    }
  )(req, res, next);
};

// Função para gerar o token JWT
const generateToken = (user: IUser): string => {
  const payload = { _id: user._id, email: user.email };
  
  return jwt.sign(payload, "TOP_SECRET");
};

export default Sign;