import { Request, Response } from "express";

const signout = async (req: Request, res: Response) => {
  // Delete cookie
  res.clearCookie("access_token");

  return res.redirect("/");
};

export default signout;
