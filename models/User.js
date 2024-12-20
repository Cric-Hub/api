import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    city: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String,
        default: null,
    },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" }
},
{
    timestamps: true,
});

export default mongoose.model("User", UserSchema);
