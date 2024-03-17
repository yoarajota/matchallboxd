import mongoose, { Schema } from "mongoose";

const Userschema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserModel = mongoose.model("rooms", Userschema);

export default UserModel;
