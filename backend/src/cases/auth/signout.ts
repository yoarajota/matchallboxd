import { Request, Response } from "express";

const signout = async (req: Request, res: Response) => {
  req.signout();
};

export default signout;
