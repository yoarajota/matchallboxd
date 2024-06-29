import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import { Log } from "../../helpers";
import _ from "lodash";

const me = async (req: Request, res: Response) => {
  try {
    return RestResponse.success(res, "Autenticado", {
      user: _.pickBy(req.user.dataValues, (_, key: string) => key !== "password"),
    });
  } catch (error) {
    Log.error(error.message);
    return RestResponse.error(res, "Usuário não autenticado");
  }
};

export default me;
