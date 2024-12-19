import Player from "../models/Player.js";

export const createPlayer = async (req, res, next) => {
    try {
        // Extract batting and bowling data or set default empty objects
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
        };

        const bowlingData = {
            matches: bowling.matches || 0,
            innings: bowling.innings || 0,
            oversBowled: bowling.oversBowled || 0,
            ballsBowled: bowling.ballsBowled || 0,
            runsConceded: bowling.runsConceded || 0,
            wickets: bowling.wickets || 0,
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
        };

        // Save the player
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

    const updateData = {};

    // Batting updates
    if (req.body.batting) {
      const batting = req.body.batting;

      if (batting.runs || batting.innings || batting.notOuts) {
        const innings = batting.innings || 1; // Prevent division by zero
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

    // Bowling updates
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

    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
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
    const { clubId } = req.params; // Extract clubId from path parameters
    try {
        const players = await Player.find({ club: clubId }); // Query players by clubId
        res.status(200).json(players); // Send players as response
    } catch (err) {
        next(err); // Pass error to middleware
    }
};
