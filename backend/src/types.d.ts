import { Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  nickname: string;
  password: string;
  isValidPassword(password: string): Promise<boolean>;
}
