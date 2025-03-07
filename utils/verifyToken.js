import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// Middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, "You are not authenticated"));
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid"));
        req.user = user; // Attach user info to request
        next();
    });
};

// Middleware to verify admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err); // Handle error from verifyToken
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return next(createError(403, "You are not authorized"));
    });
};


export const verifyClubAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err); // Handle token verification error

        if (req.user) {
            // If user is an Admin (isAdmin === true), allow access
            if (req.user.isAdmin) {
                return next();
            }

            // If user is NOT an Admin (isAdmin === false), treat them as Club Admin
            if (req.user.isAdmin === false) {
                return next();
            }
        }

        return next(createError(403, "You are not authorized"));
    });
};