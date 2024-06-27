import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import { Log } from "../../helpers";
import RoomsModel from "../../models/Rooms";

const create = async (req: Request, res: Response) => {
  try {
    // No Sequelize, use o método create para adicionar uma nova sala diretamente
    const room = await RoomsModel.create({
      admin_id: req.user.id, // Ajuste conforme a propriedade correta do usuário
    });

    // Com Sequelize, o id já está disponível após a criação
    const id = room.id;

    return RestResponse.success(res, "Nova sala criada!", {
      id,
    });
  } catch (error) {
    Log.error(error.message);
    return RestResponse.error(res, "Erro ao criar uma sala nova");
  }
};

export default create;