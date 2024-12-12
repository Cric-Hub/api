import Club from "../models/Club.js";

export const createClub = async (req, res, next) => {
    try {
        const newClub = new Club(req.body);
        const savedClub = await newClub.save();
        res.status(201).json(savedClub);
    } catch (err) {
        next(err);
    }
};

export const updateClub = async (req, res, next) => {
    try {
        const updatedClub = await Club.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true });
        res.status(200).json(updatedClub);
    } catch (err) {
        next(err);
    }
};

export const deleteClub = async (req, res, next) => {
    try {
        await Club.findByIdAndDelete(req.params.id);
        res.status(200).json("Club has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getClub = async (req, res, next) => {
    try {
        const club = await Club.findById(req.params.id).populate("players");
        res.status(200).json(club);
    } catch (err) {
        next(err);
    }
};

export const getClubs = async (req, res, next) => {
    try {
        const clubs = await Club.find();
        res.status(200).json(clubs);
    } catch (err) {
        next(err);
    }
};
