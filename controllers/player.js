import Player from "../models/Player.js";

export const createPlayer = async (req, res, next) => {
    try {
        // Merge the default values with any provided data
        const newPlayerData = {
            ...req.body,
            batting: {
                matches: 0,
                runs: 0,
                strikeRate: 0,
                ...(req.body.batting || {}), // Merge provided batting data
            },
            bowling: {
                matches: 0,
                wickets: 0,
                economy: 0,
                ...(req.body.bowling || {}), // Merge provided bowling data
            },
            fielding: {
                matches: 0,
                catches: 0,
                runOuts: 0,
                ...(req.body.fielding || {}), // Merge provided fielding data
            },
        };

        // Create and save player
        const newPlayer = new Player(newPlayerData);
        const savedPlayer = await newPlayer.save();

        res.status(201).json(savedPlayer);
    } catch (err) {
        next(err);
    }
};

export const updatePlayer = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Update specific fields without overwriting the entire object
        const updateData = {};

        if (req.body.batting) {
            Object.keys(req.body.batting).forEach((key) => {
                updateData[`batting.${key}`] = req.body.batting[key];
            });
        }
        if (req.body.bowling) {
            Object.keys(req.body.bowling).forEach((key) => {
                updateData[`bowling.${key}`] = req.body.bowling[key];
            });
        }
        if (req.body.fielding) {
            Object.keys(req.body.fielding).forEach((key) => {
                updateData[`fielding.${key}`] = req.body.fielding[key];
            });
        }

        // Perform update
        const updatedPlayer = await Player.findByIdAndUpdate(
            id,
            { $set: updateData }, // Merges nested fields
            { new: true } // Returns updated document
        );

        res.status(200).json(updatedPlayer);
    } catch (err) {
        next(err);
    }
};


export const deletePlayer = async (req, res, next) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.status(200).json("Player has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getPlayer = async (req, res, next) => {
    try {
        const player = await Player.findById(req.params.id);
        res.status(200).json(player);
    } catch (err) {
        next(err);
    }
};

export const getPlayers = async (req, res, next) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (err) {
        next(err);
    }
};

export const getPlayersByClub = async (req, res, next) => {
    const { clubId } = req.query;
    try {
        const players = await Player.find({ club: clubId });
        res.status(200).json(players);
    } catch (err) {
        next(err);
    }
};