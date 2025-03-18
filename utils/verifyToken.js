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
        req.user = user;
        next();
    });
};

// Middleware to verify admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return next(createError(403, "You are not authorized"));
    });
};

// Middleware to verify clubAdmin
export const verifyClubAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (req.user) {
            if (req.user.isAdmin) {
                return next();
            }
            if (req.user.isAdmin === false) {
                return next();
            }
        }
        return next(createError(403, "You are not authorized"));
    });
};