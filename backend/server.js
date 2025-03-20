import express from "express";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Message from "./models/Messages.js"; // Import your Message model
import Tag from "./models/Tags.js"; // Import your Tag model
import User from "./models/User.js"; // Import User model
import multer from "multer"; // Import Multer
import path from "path"; // For handling file paths
import fs from "fs";
import Conversation from "./models/Conversation.js";
import Chat from "./models/Chat.js";

import http from "http"; // Import Node's HTTP module
import { Server as SocketIOServer } from "socket.io"; // Import socket.io

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRouter);

mongoose
  .connect("mongodb://localhost:27017/rigel", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(500).json({ message: "No token found" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

const server = http.createServer(app); // Create HTTP server with Express app

// Initialize Socket.IO and attach it to the HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", // Your client origin
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Join conversation room
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

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
    console.error("Error handling tags:", error);
  }
}

app.get("/tags/top", async (req, res) => {
  try {
    const n = parseInt(req.query.n) || 10; // Get `n` from query params, default to 10
    const topTags = await Tag.find().sort({ frequency: -1 }).limit(n);
    res.status(200).json(topTags);
  } catch (error) {
    console.error("Error fetching top tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/tags/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }
    // Create a case-insensitive regular expression for the search query
    const regex = new RegExp(query, "i");
    const matchingTags = await Tag.find({ name: regex })
      .sort({ frequency: -1 })
      .limit(20);
    res.status(200).json(matchingTags);
  } catch (error) {
    console.error("Error searching tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

app.put("/messages/:id/seen", authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.userId;

    // Update the seenBy field for the given user
    await Message.findByIdAndUpdate(messageId, {
      $set: { [`seenBy.${userId}`]: true },
    });

    res.status(200).json({ message: "Post marked as seen." });
  } catch (error) {
    console.error("Error marking post as seen:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/messages/:position", authenticateToken, async (req, res) => {
  try {
    const position = parseInt(req.params.position);
    const userId = req.user.userId;

    if (isNaN(position) || position < 0) {
      return res.status(400).json({ message: "Invalid position value." });
    }

    // Retrieve the user's document to get notPreferredTags.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const notPreferredTags = user.notPreferredTags || [];

    // Filter out posts already seen by the user and posts with any not-preferred tag.
    const unseenPosts = await Message.find({
      [`seenBy.${userId}`]: { $exists: false },
      tags: { $nin: notPreferredTags }
    }).sort({ createdAt: -1 });

    if (position >= unseenPosts.length) {
      return res
        .status(404)
        .json({ message: "No more unseen posts available." });
    }

    // Get the post at the specified position
    const post = unseenPosts[position];
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the post." });
  }
});


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Ensure the `uploads` directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.post(
  "/messages",
  authenticateToken,
  upload.single("image"), // Handle single image upload
  async (req, res) => {
    try {
      const { content } = req.body;
      let { tags } = req.body;
      const authorId = req.user.userId;
      const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : "/uploads/no-picture.jpg";

      // Parse tags if it's a string (e.g., JSON stringified array)
      if (typeof tags === "string") {
        try {
          tags = JSON.parse(tags);
        } catch (err) {
          return res.status(400).json({ error: "Invalid tags format." });
        }
      }

      // Validate input
      if (!content || !tags || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({
          error:
            "Invalid input. Message content and at least one tag are required.",
        });
      }

      // Process tags: normalize and update frequency in Tag collection
      await handleTags(tags);

      // Create a new message document
      const poolMessage = new Message({
        content,
        tags,
        imageUrl, // Save the image path
        authorId,
        // seenByAuthor: true, // Mark as seen by the author upon creation
        seenBy: { [authorId]: true },
      });

      // Save the message
      await poolMessage.save();

      // Increment the user's total posts
      await User.findByIdAndUpdate(authorId, { $inc: { totalPosts: 1 } });

      res.status(201).json({
        message: "Message stored successfully",
        poolData: poolMessage,
      });
    } catch (error) {
      console.error("Error storing message:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from token in middleware
    const userProfile = await User.findById(userId);
    if (!userProfile)
      return res.status(404).json({ message: "User not found" });

    res.json({
      username: userProfile.username,
      bio: userProfile.bio || null,
      profilePicture: userProfile.profilePic || null,
      preferredTags: userProfile.preferredTags || [],
      notPreferredTags: userProfile.notPreferredTags || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/profile/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id; // Extracted from token in middleware
    const userProfile = await User.findById(userId);
    if (!userProfile)
      return res.status(404).json({ message: "User not found" });

    res.json({
      username: userProfile.username,
      bio: userProfile.bio || null,
      profilePicture: userProfile.profilePic || null,
      preferredTags: userProfile.preferredTags || [],
      notPreferredTags: userProfile.notPreferredTags || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const uploadDir = "profile_pics/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profile_pics/"); // Store in profile_pics folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const profilePicUpload = multer({
  storage: profilePicStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

app.post(
  "/upload-profile-pic",
  authenticateToken,
  profilePicUpload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.user.userId;
      const newProfilePic = `/profile_pics/${req.file.filename}`;

      // Update user profile picture in MongoDB
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePic: newProfilePic },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ profilePicture: newProfilePic });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// In server.js, after the other app.get() routes (or in a suitable location)
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { bio } = req.body; // Get the new bio from the request body

    // Update the user's bio in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Bio updated successfully",
      bio: updatedUser.bio,
    });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// In server.js, after the other /profile routes (or in a suitable location)
app.put("/profile/username", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Check if the username already exists for a different user
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Update the username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: username.trim() },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Username updated successfully",
      username: updatedUser.username,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/profile/tags", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { preferredTags, notPreferredTags } = req.body; // Expect both arrays

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferredTags, notPreferredTags },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Tags updated successfully",
      preferredTags: updatedUser.preferredTags,
      notPreferredTags: updatedUser.notPreferredTags,
    });
  } catch (error) {
    console.error("Error updating tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch chats (messages) for a specific conversation
app.get("/conversations/:id/chats", authenticateToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    // Optionally, you could check here that the user is part of the conversation.
    const chats = await Chat.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// In server.js or your chat routes file
app.post("/conversations/init", authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }

    // Check if a conversation between the two users already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error initiating conversation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all conversations for the logged-in user, with populated participant info
app.get("/conversations", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "username profilePic"); // populate username & profilePic
    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Send a message in an existing conversation
// app.post("/conversations/:id/chats", authenticateToken, async (req, res) => {
//   try {
//     const conversationId = req.params.id;
//     const senderId = req.user.userId;
//     const { content } = req.body;
    
//     if (!content) {
//       return res.status(400).json({ error: "Message content is required" });
//     }

//     // Create a new chat message
//     const chat = new Chat({
//       conversationId,
//       sender: senderId,
//       content,
//       readBy: [senderId],
//     });
//     await chat.save();

//     // Update conversation's last message information
//     await Conversation.findByIdAndUpdate(conversationId, {
//       lastMessage: { content, timestamp: new Date() },
//     });

//     res.status(201).json(chat);
//   } catch (error) {
//     console.error("Error sending message:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Example: In your POST /conversations/:id/chats endpoint, emit a new message event
app.post("/conversations/:id/chats", authenticateToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const senderId = req.user.userId;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // Create a new chat message
    const chat = new Chat({
      conversationId,
      sender: senderId,
      content,
      readBy: [senderId],
    });
    await chat.save();

    // Update conversation's last message information
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: { content, timestamp: new Date() },
    });

    // Emit new message event to all clients in this conversation's room
    io.to(conversationId).emit("newMessage", chat);

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Serve static files from the `uploads` directory
app.use("/uploads", express.static("uploads"));

app.use("/profile_pics", express.static("profile_pics"));

app.use(express.urlencoded({ extended: true }));

// app.listen(PORT, () => {
//   console.log("Server running on port:" + PORT);
// });
server.listen(PORT, () => {
  console.log("Server running on port:" + PORT);
});