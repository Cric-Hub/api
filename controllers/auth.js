import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import { createError } from "../utils/error.js"

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash
        })
        await newUser.save()
        res.status(200).json("User has been created")

    } catch (err) {
        next(err) 
    }
}

export const login = async (req, res, next) => {
    try {

        const user = await User.findOne({ username: req.body.username })
        if (!user) return next(createError(404, "User not found!"))
        
        const isPasswordCorrect = await bcrypt.compare(
            req.body.password, 
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
        );

        const {password, isAdmin, ...otherDetails} = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200)
        .json({...otherDetails, isAdmin});

    } catch (err) {
        next(err) 
    }
}

// Forgot password functionality
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) return next(createError(404, "User not found with that email!"));

        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "1d" });

        // Create transporter for sending the email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: "crickhuousl@gmail.com", 
            to: user.email,
            subject: "Reset Password Link",
            text: `Click the link to reset your password: http://localhost:3001/reset_password/${user._id}/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).send({ Status: "Error sending email" });
            }
            res.status(200).send({ Status: "Reset link sent successfully!" });
        });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then(() => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err.message }));
        })
        .catch((err) => res.send({ Status: err.message }));
    }
  });
};
