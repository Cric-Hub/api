import User from "../models/User.js"
import bcrypt from "bcryptjs"


export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { email, password, img } = req.body;

        // Validate email uniqueness if changed
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return next(createError(400, "Email already in use"));
            }
        }

        // Hash password if being updated
        if (password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);
        }

        // Build update object
        const updates = {};
        if (email) updates.email = email;
        if (password) updates.password = req.body.password;
        if (img) updates.img = img;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        next(err); // Pass error to middleware
    }
};


export const deleteUser = async (req, res, next)=>{
    try {``
        await User.findByIdAndDelete(
        req.params.id
        );
        res.status(200).json("User has been deleted.")
    } catch (err) {
        next(err)
    }
}

export const getUser = async (req, res, next)=>{
        try {
        const user = await User.findById(
            req.params.id,
            )
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }
}

export const getUsers = async (req, res, next)=>{
        try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}