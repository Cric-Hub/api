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
            httpOnly: false,
            sameSite: "strict",
            secure: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
    from: "CrickHub Support <crickhuousl@gmail.com>",
    to: user.email,
    subject: "Password Reset Request",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
            <p style="color: #555;">
                Dear ${user.name || "User"},
            </p>
            <p style="color: #555;">
                We received a request to reset the password for your account. If you did not make this request, please ignore this email. Otherwise, you can reset your password by clicking the button below:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a 
                    href="http://localhost:3001/reset_password/${user._id}/${token}" 
                    style="display: inline-block; background-color: #007BFF; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;"
                >
                    Reset Password
                </a>
            </div>
            <p style="color: #555;">
                If the button above doesn’t work, copy and paste the following URL into your browser:
            </p>
            <p style="word-wrap: break-word; color: #555;">
                <a href="http://localhost:3001/reset_password/${user._id}/${token}" style="color: #007BFF;">http://localhost:3001/reset_password/${user._id}/${token}</a>
            </p>
            <p style="color: #555;">
                For your security, this link will expire in 24 hours.
            </p>
            <p style="color: #555;">
                Regards, <br>
                The CrickHub Team
            </p>
            <hr style="border: none; border-top: 1px solid #eee;">
            <p style="text-align: center; font-size: 12px; color: #999;">
                If you did not request this email, no further action is required. Please do not share this email or link with anyone.
            </p>
        </div>
    `,
};



        transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ Status: "Error", Message: "Failed to send reset email." });
    }
    console.log("Email sent successfully:", info);
    res.status(200).send({ Status: "Success", Message: "Reset link sent successfully!" });
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

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate user ID from the URL parameter
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate the current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};