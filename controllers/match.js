import Match from "../models/Match.js";
import Club from "../models/Club.js";

export const createMatch = async (req, res, next) => {
  try {
    const newMatch = new Match(req.body);
    const savedMatch = await newMatch.save();

    // Add the match to both clubs' matches array
    await Club.findByIdAndUpdate(
      req.body.club1.club,
      { $push: { matches: savedMatch._id } },
      { new: true }
    );

    await Club.findByIdAndUpdate(
      req.body.club2.club,
      { $push: { matches: savedMatch._id } },
      { new: true }
    );

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
    const limit = parseInt(req.query.limit) || 100;
    const matches = await Match.find()
      .populate("club1.club") // Populate club1 club details
      .populate("club2.club") // Populate club2 club details
      .populate("tossWinner") // Populate tossWinner club details
      .limit(limit); // Apply the limit after populating

    res.status(200).json(matches);
  } catch (err) {
    next(err);
  }
};


// Get matches by club
export const getMatchesByClub = async (req, res, next) => {
  const { clubId } = req.params; 

  try {
    // Find the club and populate the matches field
    const club = await Club.findById(clubId)
      .populate({
        path: "matches",
        populate: [
          { path: "club1.club", model: "Club" },
          { path: "club2.club", model: "Club" },
          { path: "club1.players", model: "Player" },
          { path: "club2.players", model: "Player" },
        ],
      });

    if (!club) {
      return next(createError(404, "Club not found"));
    }

    res.status(200).json(club.matches);
  } catch (err) {
    next(err);
  }
};