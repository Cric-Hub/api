import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import matchesRoute from "./routes/match.js";
import clubsRoute from "./routes/club.js";
import playersRoute from "./routes/player.js";
import newsRoute from "./routes/news.js";
import rankingRoute from "./routes/ranking.js";
import cron from "node-cron";
import calculateRankings from "./utils/ranking.js";


const app = express();
dotenv.config();

//middlewares


app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/matches', matchesRoute);
app.use('/api/clubs', clubsRoute);
app.use('/api/players', playersRoute);
app.use('/api/news', newsRoute);
app.use('/api/ranking', rankingRoute);

// Error Handling
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong !";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

cron.schedule("0 0 * * *", async () => {
    try {
        await calculateRankings();
        console.log("Rankings updated successfully");
    } catch (err) {
        console.error("Error updating rankings:", err);
    }
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB();
    console.log("Connected to backend!");
});
