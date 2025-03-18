import mongoose from "mongoose";

const { Schema } = mongoose;

const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"],
      required: true,
    },
    battingStyle: {
      type: String,
      default: "",
    },
    bowlingStyle: {
      type: String,
      default: "",
    },
    batting: {
      type: Object,
      default: {
        matches: 0,
        innings: 0,
        runs: 0,
        ballsFaced: 0,
        highestScore: 0,
        notOuts: 0,
        average: 0,
        strikeRate: 0,
      },
    },
    bowling: {
      type: Object,
      default: {
        matches: 0,
        innings: 0,
        ballsBowled: 0,
        runsConceded: 0,
        wickets: 0,
        economy: 0,
        average: 0,
        strikeRate: 0,
      },
    },
    fielding: {
      type: Object,
      default: {
        matches: 0,
        catches: 0,
        runOuts: 0,
        stumpings: 0,
      },
    },
    battingRank: {
      type: Number,
      default: 0,
    },
    bowlingRank: {
      type: Number,
      default: 0,
    },
    allRounderRank: {
      type: Number,
      default: 0,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Player", PlayerSchema);