import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import { Log } from "../../helpers";
import RoomsModel from "../../models/Rooms";

const index = async (req: Request, res: Response) => {
  try {
    // Test if the room exists
    const exists = await RoomsModel.exists({ _id: req.params.id });

    if (!exists) {
      throw new Error();
    }

    return RestResponse.success(res, "Sala encontrada!");
  } catch (error) {
    Log.error(error.message);
    return RestResponse.error(res, "Sala não encontrada!");
  }
};

export default index;
