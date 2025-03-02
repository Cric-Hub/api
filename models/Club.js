import mongoose from "mongoose";

const { Schema } = mongoose;

const ClubSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
}, { timestamps: true });

export default mongoose.model("Club", ClubSchema);
