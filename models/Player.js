import mongoose from "mongoose";

const { Schema } = mongoose;

const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batting: {
      type: Object,
      default: {
        matches: 0,
        runs: 0,
        strikeRate: 0, // Use a float to capture more precise data
      },
    },
    bowling: {
      type: Object,
      default: {
        matches: 0,
        wickets: 0,
        economy: 0, // Use a float for economy rates
      },
    },
    fielding: {
      type: Object,
      default: {
        matches: 0,
        catches: 0,
        runOuts: 0, // Added consistent camelCase for naming
      },
    },
    club: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Club" // Reference to Club model
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model("Player", PlayerSchema);
