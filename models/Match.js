import mongoose from "mongoose";

const { Schema } = mongoose;

const MatchSchema = new Schema({
    club1: {
        club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
        score: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
    },
    club2: {
        club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
        score: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
    },
    overs: { type: Number, required: true },
    tossWinner: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    tossChoice: { type: String, required: true }, // "Bat" or "Bowl"
    status: { type: String, default: "Live" },    // "Live", "Completed", etc.
    currentInnings: { type: String, enum: ["club1", "club2"], required: true },
}, { timestamps: true });

export default mongoose.model("Match", MatchSchema);
