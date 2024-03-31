import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../../types";
import passport from "../../auth";
import _ from "lodash";
import { RestResponse } from "../../helpers/RestResponse";

const signin = (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(
    "signin",
    async (err: Error, user: IUser | false, info: any) => {
      try {
        if (err) {
          return next(err); // Encaminha para o próximo middleware de erro
        }

        if (!user) {
          return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Autenticação bem-sucedida
        req.login(user, { session: false }, async (error: Error) => {
          if (error) {
            return next(error); // Encaminha para o próximo middleware de erro
          }

          const token = generateToken(user);

          res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 *  24 * 7
          });

          return RestResponse.success(res, "Authenticado com sucesso", {
            user: _.pickBy(user._doc, (_, key: string) => key !== "password"),
          });
        });
      } catch (error) {
        console.log(error)

        return next(error); // Encaminha para o próximo middleware de erro
      }
    }
  )(req, res, next);
};

// Função para gerar o token JWT
const generateToken = (user: IUser): string => {
  const payload = { _id: user._id, nickname: user.nickname };

  return jwt.sign(payload, "TOP_SECRET");
};

export default signin;
