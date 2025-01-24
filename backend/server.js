import express from 'express';
import authRouter from './routes/auth.js';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Message from './models/Messages.js'; // Import your Message model
import Tag from './models/Tags.js'; // Import your Tag model

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/auth', authRouter);

mongoose
    .connect('mongodb://localhost:27017/rigel', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(500).json({ message: 'No token found' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

async function handleTags(tags) {
    try {
        const tagPromises = tags.map(async (tag) => {
            const normalizedTag = tag.trim().toLowerCase(); // Normalize tag
            const existingTag = await Tag.findOne({ name: normalizedTag });
            if (existingTag) {
                // Increment frequency if tag exists
                existingTag.frequency += 1;
                existingTag.lastUsed = new Date();
                await existingTag.save();
            } else {
                // Create a new tag
                const newTag = new Tag({ name: normalizedTag, frequency: 1 });
                await newTag.save();
            }
        });

        await Promise.all(tagPromises);
    } catch (error) {
        console.error('Error handling tags:', error);
    }
}

app.post('/messages', authenticateToken, async (req, res) => {
    try {
        const { content, tags } = req.body;
        const authorId = req.user.userId;
        console.log(content)
        console.log(tags)

        // Validate input
        if (!content || !tags || !Array.isArray(tags) || tags.length === 0) {
            return res
                .status(400)
                .json({ error: 'Invalid input. Message content and at least one tag are required.' });
        }

        // Process tags: normalize and update frequency in Tag collection
        await handleTags(tags);

        // Create a new message document for the general pool
        const poolMessage = new Message({
            content,
            tags,
            createdAt: new Date(),
            authorId: authorId, // Assuming `authenticateToken` sets `req.user`
        });

        // Save the message
        await poolMessage.save();

        res.status(201).json({
            message: 'Message stored successfully',
            poolData: poolMessage,
        });
    } catch (error) {
        console.error('Error storing message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/tags/top', async (req, res) => {
  try {
    const n = parseInt(req.query.n) || 10; // Get `n` from query params, default to 10
    const topTags = await Tag.find().sort({ frequency: -1 }).limit(n);
    res.status(200).json(topTags);
  } catch (error) {
    console.error('Error fetching top tags:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/messages", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Get page and limit from query params
        const skip = (page - 1) * limit;

        const messages = await Message.find({})
            .sort({ createdAt: -1 }) // Sort by latest
            .skip(skip)
            .limit(Number(limit)); // Paginate

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(PORT, () => {
    console.log('Server running on port:' + PORT);
});
