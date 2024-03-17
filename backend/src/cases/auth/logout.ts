import { Request, Response } from "express";

const logout = async (req: Request, res: Response) => {
  req.logout();
};

export default logout;
