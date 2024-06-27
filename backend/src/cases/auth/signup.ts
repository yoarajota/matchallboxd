import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import UserModel from "../../models/Users";
import { Log } from "../../helpers";
import { IUser } from "../../types";

const signup = async (req: Request, res: Response) => {
  try {
    // Assegure que req.body seja do tipo correto
    const newUserAttributes: IUser = req.body;

    await UserModel.create(newUserAttributes as IUser);

    return RestResponse.success(res, "Cadastrado com sucesso");
  } catch (error) {
    Log.error(error.message)
    return RestResponse.error(res, "Falha ao criar o cadastro");
  }
};

export default signup;