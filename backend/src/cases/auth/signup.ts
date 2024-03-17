import { Request, Response } from "express";
import { RestResponse } from "../../helpers/RestResponse";
import UserModel from "../../models/Users";

const signup = async (req: Request, res: Response) => {
  try {
    await UserModel.create(req.body);

    return RestResponse.success(res, "User created");
  } catch (error) {
    return RestResponse.error(res, "Failed to create user");
  }
};

export default signup;
