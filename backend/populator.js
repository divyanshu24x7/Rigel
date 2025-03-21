import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';
import Message from './models/Messages.js';
import User from './models/User.js';
import Tags from './models/Tags.js';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rigel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// Function to fetch a random cat image URL for profile pictures
async function fetchRandomCatImage() {
    try {
        const response = await fetch('https://cataas.com/cat?json=true');
        const data = await response.json();
        return `https://cataas.com/cat/${data._id}`;
    } catch (error) {
        console.error('Error fetching cat image:', error);
        return '/profile_pics/default.jpg';
    }
}


// Function to fetch a random image URL for post images
async function fetchRandomPostImage() {
    try {
        const response = await fetch('https://picsum.photos/200/300');
        return response.url;
    } catch (error) {
        console.error('Error fetching post image:', error);
        return '/uploads/no-picture.jpg';
    }
}

// Predefined theme-relevant tags
const themeTags = {
    Commerce: ["shopping", "products", "sales", "discounts", "deals"],
    Company: ["business", "startup", "growth", "innovation", "leadership"],
    Music: ["songs", "artists", "genres", "albums", "music"],
    Science: ["chemistry", "biology", "research", "innovation", "discovery"],
    // { name: 'Sports', method: () => faker.sports.sport() }, // Commented out as requested
    Hacker: ["cybersecurity", "technology", "coding", "hacking", "data"],
};

// Randomized theme content generator with length control
function generateThemedContent() {
    const themes = [
        { name: 'Commerce', method: () => faker.commerce.productDescription() },
        { name: 'Company', method: () => faker.company.catchPhrase() },
        { name: 'Music', method: () => faker.music.songName() },
        { name: 'Science', method: () => faker.science.chemicalElement().name },
        { name: 'Hacker', method: () => faker.hacker.phrase() },
    ];

    // Randomly pick a theme
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    let content = selectedTheme.method();

    // Enforce content length between 400 and 499 characters
    while (content.length < 400) {
        content += ' ' + selectedTheme.method();
    }
    content = content.slice(0, 499); // Trim to a max of 499 characters

    console.log(`Generated ${selectedTheme.name} Content (${content.length} chars):`, content);
    return { content, theme: selectedTheme.name };
}

// Function to generate tags relevant to the theme
async function generateRelevantTags(theme) {
    const tags = themeTags[theme] || [];
    const randomTagCount = Math.floor(Math.random() * 4) + 1; // Between 1 and 4 tags
    const selectedTags = [];

    // Randomly select tags from the theme's tag pool
    for (let i = 0; i < randomTagCount; i++) {
        const tag = tags[Math.floor(Math.random() * tags.length)];
        if (tag && !selectedTags.includes(tag)) {
            selectedTags.push(tag);
        }
    }

    for (let i = 0; i < selectedTags.length; i++) {
        const tagName = selectedTags[i];

        // Check if the tag already exists in the database
        const existingTag = await Tags.findOne({ name: tagName });

        if (existingTag) {
            // If the tag exists, increment its frequency and update `lastUsed`
            existingTag.frequency += 1;
            existingTag.lastUsed = new Date();
            await existingTag.save();
        } else {
            // If the tag doesn't exist, create a new entry
            const newTag = new Tags({
                name: tagName,
                frequency: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastUsed: new Date(),
                isTrending: false,
            });
            await newTag.save();
        }
    }

    console.log(`Generated Tags for theme "${theme}":`, selectedTags);
    return selectedTags;
}


// Function to generate a random user
// Function to generate a random user
// Function to generate a random user
async function generateRandomUser(messagesPerUser) {
    const username = faker.internet.userName();
    let email = faker.internet.email();
    
    // Ensure email is unique
    let emailExists = await User.findOne({ email });
    while (emailExists) {
        console.log(`Duplicate email found: ${email}. Generating a new one...`);
        email = faker.internet.email();
        emailExists = await User.findOne({ email });
    }

    const password = faker.internet.password();
    const profilePic = await fetchRandomCatImage();
    const bio = generateThemedContent().content;

    const user = new User({
        username: username,
        email: email,
        password: password,
        profilePic: profilePic,
        bio: bio,
        preferredTags: [],
        notPreferredTags: [],
        totalPosts: messagesPerUser, // Default value; will update later
    });

    // Save the user to the database
    await user.save();
    
    // Generate the posts for this user and update totalPosts
    let posts = [];
    for (let j = 0; j < messagesPerUser; j++) {
        const message = await generateRandomMessage(user);
        posts.push(message);
    }

    // Update the totalPosts field with the correct number
    user.totalPosts = posts.length;
    console.log(`User ${user.username} has ${user.totalPosts} posts.`);

    return user;
}




// Function to generate a random message
async function generateRandomMessage(author) {
    const { content, theme } = generateThemedContent();
    console.log("theme: ", theme);
    const tags = await generateRelevantTags(theme);
    console.log("tags: ", tags);
    const imageUrl = await fetchRandomPostImage();
    console.log("imageUrl: ", imageUrl);

    const message = new Message({
        content: content,
        tags: tags,
        authorId: author._id, // Reference to the user's ObjectId
        status: 'in pool',
        imageUrl: imageUrl,
        createdAt: new Date(),
        lastActionAt: null,
        repliedBy: null,
        isInPool: true,
    });

    // Save the message to the database
    await message.save();

    console.log('Generated Message:', message);
    return message;
}

// Main function to simulate data generation
async function simulateData(userCount, messagesPerUser) {
    console.log('The beginning of the simulation');
    for (let i = 0; i < userCount; i++) {
        const user = await generateRandomUser(messagesPerUser);
        // Optionally, save user and posts to MongoDB here

        // Log the user with posts
        console.log(`Generated ${user.name} with ${user.totalPosts} posts.`);
    }
}

// Simulate and display the data in the terminal
simulateData(1, 1) // Adjust user count and messages per user as needed
    .then(() => {
        console.log('Data simulation complete! All data displayed on the terminal.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error during data simulation:', err);
        mongoose.connection.close();
    });