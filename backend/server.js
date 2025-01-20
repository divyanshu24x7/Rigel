import express from 'express'
import authRouter from './routes/auth.js'
import mongoose from 'mongoose';
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import Message from './models/Messages.js'; // Import your Message model
// import UserMessage from './models/UserMessage.js';
const app = express()
dotenv.config()
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
};
//Middleware
app.use(cors(corsOptions));
app.use(express.json())
app.use("/auth", authRouter)

mongoose
    .connect('mongodb://localhost:27017/rigel', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        return res.status(500).json({ message: "No token found" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

app.post("/messages", authenticateToken, async (req, res) => {
    try {
        const { content, tags } = req.body;
        console.log(req.user.userId)
        const authorId = req.user.userId;
        // Validate input
        if (!content || !tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ error: "Invalid input. Message content and at least one tag are required." });
        }

        // Create a new message document for the general pool
        const poolMessage = new Message({
            content,
            tags,
            createdAt: new Date(),
            authorId: authorId, // Assuming `authenticateToken` sets `req.user`
        });

        // // Create a new user-specific message document
        // const userMessage = new UserMessage({
        //     content,
        //     tags,
        //     authorId: authorId,
        //     createdAt: new Date(),
        //     status: 'in pool',
        //     isInPool: true,
        // });

        // Save both documents
        // await Promise.all([poolMessage.save(), userMessage.save()]);
        await Promise.all([poolMessage.save()]);

        res.status(201).json({
            message: "Message stored successfully",
            poolData: poolMessage,
            // userData: userMessage,
        });
    } catch (error) {
        console.error("Error storing message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port:" + PORT)
})