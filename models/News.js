import mongoose from "mongoose";

const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, 
      default: "", 
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);
