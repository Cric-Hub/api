import mongoose from "mongoose";

const { Schema } = mongoose;

const MatchSchema = new Schema({
    team1: {
        name: { type: String, required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
        score: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
    },
    team2: {
        name: { type: String, required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
        score: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
    },
    overs: { type: Number, required: true },
    tossWinner: { type: String, required: true },
    tossChoice: { type: String, required: true },
    status: { type: String, default: "Live" },
    currentInnings: { type: String, enum: ["team1", "team2"], required: true },
}, { timestamps: true });

export default mongoose.model("Match", MatchSchema);
