import mongoose, { Schema } from "mongoose";

const roomsSchema = new Schema({
    admin_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
});

const RoomsModel = mongoose.model("rooms", roomsSchema);

export default RoomsModel;
