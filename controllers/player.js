import Player from "../models/Player.js";
import Club from "../models/Club.js"; 

export const createPlayer = async (req, res, next) => {
    try {
        // Extract batting, bowling, and fielding data or set default empty objects
        const batting = req.body.batting || {};
        const bowling = req.body.bowling || {};
        const fielding = req.body.fielding || {};

        // Ensure all fields have default values if not provided
        const battingData = {
            matches: batting.matches || 0,
            innings: batting.innings || 0,
            runs: batting.runs || 0,
            ballsFaced: batting.ballsFaced || 0,
            highestScore: batting.highestScore || 0,
            notOuts: batting.notOuts || 0,
            average: 0, 
            strikeRate: 0, 
        };

        const bowlingData = {
            matches: bowling.matches || 0,
            innings: bowling.innings || 0,
            oversBowled: bowling.oversBowled || 0,
            ballsBowled: bowling.ballsBowled || 0,
            runsConceded: bowling.runsConceded || 0,
            wickets: bowling.wickets || 0,
            economy: 0, 
            average: 0, 
            strikeRate: 0, 
        };

        const fieldingData = {
            matches: fielding.matches || 0,
            catches: fielding.catches || 0,
            runOuts: fielding.runOuts || 0,
            stumpings: fielding.stumpings || 0,
        };

        // Calculate batting average and strike rate
        const battingAverage =
            battingData.innings && battingData.notOuts !== undefined
                ? battingData.runs / (battingData.innings - battingData.notOuts || 1)
                : 0;
        const battingStrikeRate =
            battingData.runs && battingData.ballsFaced
                ? (battingData.runs * 100) / battingData.ballsFaced
                : 0;

        // Calculate bowling economy, average, and strike rate
        const bowlingEconomy =
            bowlingData.oversBowled
                ? bowlingData.runsConceded / bowlingData.oversBowled
                : 0;
        const bowlingAverage =
            bowlingData.wickets
                ? bowlingData.runsConceded / bowlingData.wickets
                : 0;
        const bowlingStrikeRate =
            bowlingData.wickets
                ? (bowlingData.oversBowled * 6) / bowlingData.wickets
                : 0;

        // Create the new player data with calculations
        const newPlayerData = {
            name: req.body.name || "Unknown Player",
            club: req.body.club || null,
            img: req.body.img,
            dob: req.body.dob,
            bio: req.body.bio,
            battingStyle: req.body.battingstyle,
            bowlingStyle: req.body.bowlingstyle,
            role: req.body.role,
            batting: {
                ...battingData,
                average: parseFloat(battingAverage.toFixed(2)),
                strikeRate: parseFloat(battingStrikeRate.toFixed(2)),
            },
            bowling: {
                ...bowlingData,
                economy: parseFloat(bowlingEconomy.toFixed(2)),
                average: parseFloat(bowlingAverage.toFixed(2)),
                strikeRate: parseFloat(bowlingStrikeRate.toFixed(2)),
            },
            fielding: fieldingData,
            battingRank: 0,
            bowlingRank: 0, 
            allRounderRank: 0, 
        };

        // Save the player
        const newPlayer = new Player(newPlayerData);
        const savedPlayer = await newPlayer.save();

        // If the player is associated with a club, update the club's players array
        if (req.body.club) {
            await Club.findByIdAndUpdate(
                req.body.club,
                { $push: { players: savedPlayer._id } }, 
                { new: true }
            );
        }

        res.status(201).json(savedPlayer);
    } catch (err) {
        next(err);
    }
};

export const createPlayerByClub = async (req, res, next) => {
    try {
        const { user } = req;

        if (!user.club) {
            return next(createError(403, "You are not associated with any club."));
        }

        // Extract batting, bowling, and fielding data or set default empty objects
        const batting = req.body.batting || {};
        const bowling = req.body.bowling || {};
        const fielding = req.body.fielding || {};

        // Ensure all fields have default values if not provided
        const battingData = {
            matches: batting.matches || 0,
            innings: batting.innings || 0,
            runs: batting.runs || 0,
            ballsFaced: batting.ballsFaced || 0,
            highestScore: batting.highestScore || 0,
            notOuts: batting.notOuts || 0,
            average: 0, 
            strikeRate: 0,
        };

        const bowlingData = {
            matches: bowling.matches || 0,
            innings: bowling.innings || 0,
            oversBowled: bowling.oversBowled || 0,
            ballsBowled: bowling.ballsBowled || 0,
            runsConceded: bowling.runsConceded || 0,
            wickets: bowling.wickets || 0,
            economy: 0, 
            average: 0, 
            strikeRate: 0,
        };

        const fieldingData = {
            matches: fielding.matches || 0,
            catches: fielding.catches || 0,
            runOuts: fielding.runOuts || 0,
            stumpings: fielding.stumpings || 0,
        };

        // Calculate batting average and strike rate
        const battingAverage =
            battingData.innings && battingData.notOuts !== undefined
                ? battingData.runs / (battingData.innings - battingData.notOuts || 1)
                : 0;
        const battingStrikeRate =
            battingData.runs && battingData.ballsFaced
                ? (battingData.runs * 100) / battingData.ballsFaced
                : 0;

        // Calculate bowling economy, average, and strike rate
        const bowlingEconomy =
            bowlingData.oversBowled
                ? bowlingData.runsConceded / bowlingData.oversBowled
                : 0;
        const bowlingAverage =
            bowlingData.wickets
                ? bowlingData.runsConceded / bowlingData.wickets
                : 0;
        const bowlingStrikeRate =
            bowlingData.wickets
                ? (bowlingData.oversBowled * 6) / bowlingData.wickets
                : 0;

        // Create the new player data with calculations
        const newPlayerData = {
            name: req.body.name || "Unknown Player",
            club: user.club, 
            img: req.body.img,
            dob: req.body.dob,
            bio: req.body.bio,
            battingStyle: req.body.battingstyle,
            bowlingStyle: req.body.bowlingstyle,
            role: req.body.role,
            batting: {
                ...battingData,
                average: parseFloat(battingAverage.toFixed(2)),
                strikeRate: parseFloat(battingStrikeRate.toFixed(2)),
            },
            bowling: {
                ...bowlingData,
                economy: parseFloat(bowlingEconomy.toFixed(2)),
                average: parseFloat(bowlingAverage.toFixed(2)),
                strikeRate: parseFloat(bowlingStrikeRate.toFixed(2)),
            },
            fielding: fieldingData,
            battingRank: 0, 
            bowlingRank: 0, 
            allRounderRank: 0, 
        };

        // Save the player
        const newPlayer = new Player(newPlayerData);
        const savedPlayer = await newPlayer.save();

        // Update the club's players array
        await Club.findByIdAndUpdate(
            user.club,
            { $push: { players: savedPlayer._id } }, 
            { new: true }
        );

        res.status(201).json(savedPlayer);
    } catch (err) {
        next(err);
    }
};


export const updatePlayer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = {};
        //General Player Info Updates
        const fieldsToUpdate = ["name", "dob", "bio", "role", "battingStyle", "bowlingStyle", "battingRank", "bowlingRank", "allRounderRank", "club", "img"];
        fieldsToUpdate.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        // Batting Updates
        if (req.body.batting) {
            const batting = req.body.batting;
            if (batting.runs || batting.innings || batting.notOuts) {
                const innings = batting.innings || 1; 
                const notOuts = batting.notOuts || 0;
                const runs = batting.runs || 0;
                const ballsFaced = batting.ballsFaced || 1;
                updateData["batting.average"] = runs / (innings - notOuts);
                updateData["batting.strikeRate"] = (runs * 100) / ballsFaced;
            }
            Object.keys(batting).forEach((key) => {
                updateData[`batting.${key}`] = batting[key];
            });
        }
        // Bowling Updates
        if (req.body.bowling) {
            const bowling = req.body.bowling;
            if (bowling.runsConceded || bowling.ballsBowled || bowling.wickets) {
                const ballsBowled = bowling.ballsBowled || 1; // Prevent division by zero
                const runsConceded = bowling.runsConceded || 0;
                const wickets = bowling.wickets || 1;

                updateData["bowling.economy"] = runsConceded / (ballsBowled / 6);
                updateData["bowling.average"] = runsConceded / wickets;
                updateData["bowling.strikeRate"] = ballsBowled / wickets;
            }
            Object.keys(bowling).forEach((key) => {
                updateData[`bowling.${key}`] = bowling[key];
            });
        }
        // Fielding Updates
        if (req.body.fielding) {
            Object.keys(req.body.fielding).forEach((key) => {
                updateData[`fielding.${key}`] = req.body.fielding[key];
            });
        }
        // Update Player in Database
        const updatedPlayer = await Player.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (!updatedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.status(200).json({ message: "Player updated successfully", updatedPlayer });
    } catch (error) {
        console.error("Error updating player:", error);
        res.status(500).json({ message: "Internal server error" });
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
        const players = await Player.find().populate("club");
        res.status(200).json(players);
    } catch (err) {
        next(err);
    }
};

export const getPlayersByClub = async (req, res, next) => {
    const { clubId } = req.params;
    try {
        const club = await Club.findById(clubId).populate("players"); 
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        const players = club.players;
        res.status(200).json(players); 
    } catch (err) {
        next(err); 
    }
};

export const filterPlayers = async (req, res) => {
    const {
        name,
        minRuns,
        maxRuns,
        minBattingAvg,
        maxBattingAvg,
        minBowlingAvg,
        maxBowlingAvg,
    } = req.query;

    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (minRuns || maxRuns) query['batting.runs'] = {};
    if (minRuns) query['batting.runs'].$gte = parseInt(minRuns);
    if (maxRuns) query['batting.runs'].$lte = parseInt(maxRuns);
    if (minBattingAvg || maxBattingAvg) query['batting.average'] = {};
    if (minBattingAvg) query['batting.average'].$gte = parseFloat(minBattingAvg);
    if (maxBattingAvg) query['batting.average'].$lte = parseFloat(maxBattingAvg);
    if (minBowlingAvg || maxBowlingAvg) query['bowling.average'] = {};
    if (minBowlingAvg) query['bowling.average'].$gte = parseFloat(minBowlingAvg);
    if (maxBowlingAvg) query['bowling.average'].$lte = parseFloat(maxBowlingAvg);

    try {
        const players = await Player.find(query);
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
