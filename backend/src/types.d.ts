import { Document, InferSchemaType } from "mongoose";
import { Userschema } from "./models/Users";

type IUser = InferSchemaType<typeof Userschema> extends Document