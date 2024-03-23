import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const Userschema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

Userschema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

Userschema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const UserModel = mongoose.model("Users", Userschema);

export default UserModel;
