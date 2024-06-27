// import mongoose, { InferSchemaType, Schema } from "mongoose";
// import bcrypt from "bcrypt";

// export const Userschema = new Schema({
//   nickname: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// Userschema.pre("save", async function (next) {
//   const hash = await bcrypt.hash(this.password, 10);

//   this.password = hash;
//   next();
// });

// Userschema.methods.isValidPassword = async function (password) {
//   const user = this;
//   const compare = await bcrypt.compare(password, user.password);

//   return compare;
// };

// const UserModel = mongoose.model("Users", Userschema);

// export default UserModel;

import { Model, DataTypes } from "sequelize";
import sequelize from "../helpers/sequelize";
import bcrypt from "bcrypt";

class User extends Model {
  public id!: number;
  public nickname!: string;
  public username!: string;
  public password!: string;

  // Método para validar a senha
  public async isValidPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      // Hook para hash da senha antes de salvar
      beforeCreate: async (user: User) => {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          const hash = await bcrypt.hash(user.password, 10);
          user.password = hash;
        }
      },
    },
  }
);

export default User;
