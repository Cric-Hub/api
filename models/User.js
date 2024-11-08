import mangoose from "mongoose";
const { Schema } = mangoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }, 
},
    {
        timestamps: true
    }
)

export default mangoose.model("User", UserSchema)
