import mongoose, { Schema } from "mongoose";

const roomsSchema = new Schema();

const RoomsModel = mongoose.model("rooms", roomsSchema);

export default RoomsModel;
