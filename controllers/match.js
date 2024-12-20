import Match from "../models/Match.js";

export const createMatch = async (req, res, next) => {
    try {
        const newMatch = new Match(req.body);
        const savedMatch = await newMatch.save();
        res.status(201).json(savedMatch);
    } catch (err) {
        next(err);
    }
};

export const updateMatch = async (req, res, next) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedMatch);
    } catch (err) {
        next(err);
    }
};

export const deleteMatch = async (req, res, next) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.status(200).json("Match has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getMatch = async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.id);
        res.status(200).json(match);
    } catch (err) {
        next(err);
    }
};

export const getMatches = async (req, res, next) => {
    try {
        const matches = await Match.find();
        res.status(200).json(matches);
    } catch (err) {
        next(err);
    }
};

// Get matches by club
export const getMatchesByClub = async (req, res, next) => {
    const { clubId } = req.params; // Extract clubId from path parameters

    try {
        const matches = await Match.find({
            $or: [
                { "club1.club": clubId },
                { "club2.club": clubId }
            ]
        })
        .populate("club1.club club2.club")
        .populate("club1.players club2.players");

        res.status(200).json(matches);
    } catch (err) {
        next(err);
    }
};

