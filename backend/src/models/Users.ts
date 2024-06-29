import { Model, DataTypes } from "sequelize";
import sequelize from "../helpers/sequelize";
import bcrypt from "bcrypt";

class User extends Model {
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
