import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

const router = express.Router();
dotenv.config();

router.post("/SignUp", async (req, res) => {
    try {
        const email = req.body.username;
        const password = req.body.password;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "User already exists" });
        }

        // Function to generate a unique username
        const generateUniqueUsername = async () => {
            let username;
            let isUnique = false;
            do {
                // Generate a random username using faker
                username = faker.internet.userName();
                // Check if the username already exists in the database
                const existingUser = await User.findOne({ username });
                if (!existingUser) {
                    isUnique = true;
                }
            } while (!isUnique);
            return username;
        };

        const username = await generateUniqueUsername();

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            email,
            username,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: "User added successfully", username });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Could not add new user");
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        console.log(accessToken);
        res.status(200).json({
            message: "Login successful",
            accessToken,
            userId: user._id,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error during login" });
    }
});

export default router;
