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


const app = express();
dotenv.config();

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","http://localhost:3001"],
    credentials: true,
}));

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/matches', matchesRoute);
app.use('/api/clubs', clubsRoute);
app.use('/api/players', playersRoute);
app.use('/api/news', newsRoute);

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

// Start Server
app.listen(8000, () => {
    connectDB();
    console.log("Connected to backend!");
});