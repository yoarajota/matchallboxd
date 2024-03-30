import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import UserModel from "../../models/Users";
import { Log } from "../../helpers";

const signup = async (req: Request, res: Response) => {
  try {
    await UserModel.create(req.body);

    return RestResponse.success(res, "Cadastrado com sucesso");
  } catch (error) {
    Log.error(error.message)
    return RestResponse.error(res, "Falha ao criar o cadastro");
  }
};

export default signup;
