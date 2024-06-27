import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import { Log } from "../../helpers";
import RoomsModel from "../../models/Rooms";

const index = async (req: Request, res: Response) => {
  try {
    // Tenta encontrar a sala pelo ID
    const room = await RoomsModel.findByPk(req.params.id);

    if (!room) {
      // Se não encontrar a sala, lança um erro
      throw new Error("Sala não encontrada!");
    }

    // Se a sala for encontrada, retorna sucesso
    return RestResponse.success(res, "Sala encontrada!");
  } catch (error) {
    Log.error(error.message);
    return RestResponse.error(res, "Sala não encontrada!");
  }
};

export default index;