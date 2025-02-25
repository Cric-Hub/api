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

// Middleware to verify user
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err); // Handle error from verifyToken
        const userId = req.params.id || req.body.id || req.query.id || req.user.id; // Check params or body for ID
        if (req.user && (req.user.id === userId || req.user.isAdmin)) {
            return next();
        }
        return next(createError(403, "You are not authorized"));
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


export const verifyClubAdmin = async (req, res, next) => {
    try {
        const clubId = req.params.club || req.body.club|| req.query.clubId;
        console.log(clubId);
        
        // Find the club associated with the admin
        const adminClub = await Club.findOne({ _id: req.user.club });

        if (!adminClub) {
            return next(createError(404, "Your assigned club does not exist"));
        }

        // Check if the requested club matches the admin's club
        if (adminClub._id.toString() !== clubId) {
            return next(createError(403, "You are not authorized to manage this club"));
        }

        // If the club matches, proceed
        next();
    } catch (err) {
        return next(createError(500, "Internal Server Error"));
    }
};



export const verifyNewAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err); // Handle error from verifyToken
        const clubId = req.params.club || req.body.club|| req.query.clubId;
        if (req.user && req.user.isAdmin) {
            return next();
        }
        return next(createError(403, "You are not authorized"));
    });
};