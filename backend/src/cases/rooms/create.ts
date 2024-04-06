import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import { Log } from "../../helpers";
import RoomsModel from "../../models/Rooms";

const create = async (req: Request, res: Response) => {
  try {
    const room = new RoomsModel({
      admin_id: req.user._id,
    });
    await room.save();

    // Get the room id
    const id = room._id;

    return RestResponse.success(res, "Nova sala criada!", {
      id,
    });
  } catch (error) {
    Log.error(error.message);
    return RestResponse.error(res, "Erro ao criar uma sala nova");
  }
};

export default create;
