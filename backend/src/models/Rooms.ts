// import mongoose, { Schema } from "mongoose";

// const roomsSchema = new Schema({
//     admin_id: {
//         type: Schema.Types.ObjectId,
//         ref: "users",
//         required: true,
//     }
// });

// const RoomsModel = mongoose.model("rooms", roomsSchema);

// export default RoomsModel;

import { Model, DataTypes } from "sequelize";
import sequelize from "../helpers/sequelize";

class Room extends Model {}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "rooms",
  }
);

export default Room;
