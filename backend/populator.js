import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/your_database_name', {
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
function generateRelevantTags(theme) {
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

    console.log(`Generated Tags for theme "${theme}":`, selectedTags);
    return selectedTags;
}

// Function to generate a random user
async function generateRandomUser(messagesPerUser) {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const profilePic = await fetchRandomCatImage();
    const bio = generateThemedContent().content;

    const user = {
        name: username,
        email: email,
        password: password,
        profilePic: profilePic,
        bio: bio,
        preferredTags: [],
        notPreferredTags: [],
        totalPosts: 0, // Default value; will update later
    };

    console.log('Generated User:', user);
    
    // Generate the posts for this user and update totalPosts
    let posts = [];
    for (let j = 0; j < messagesPerUser; j++) {
        const message = await generateRandomMessage(user);
        posts.push(message);
    }

    // Update the totalPosts field with the correct number
    user.totalPosts = posts.length;
    console.log(`User ${user.name} has ${user.totalPosts} posts.`);

    return user;
}

// Function to generate a random message
async function generateRandomMessage(author) {
    const { content, theme } = generateThemedContent();
    const tags = generateRelevantTags(theme);
    const imageUrl = await fetchRandomPostImage();

    const message = {
        content: content,
        tags: tags,
        authorId: author.name, // Just displaying the author name for now
        status: 'in pool',
        imageUrl: imageUrl,
        createdAt: new Date(),
        lastActionAt: null,
        repliedBy: null,
        isInPool: true,
    };

    console.log('Generated Message:', message);
    return message;
}

// Main function to simulate data generation
async function simulateData(userCount, messagesPerUser) {
    for (let i = 0; i < userCount; i++) {
        const user = await generateRandomUser(messagesPerUser);
        // Optionally, save user and posts to MongoDB here

        // Log the user with posts
        console.log(`Generated ${user.name} with ${user.totalPosts} posts.`);
    }
}

// Simulate and display the data in the terminal
simulateData(3, 2) // Adjust user count and messages per user as needed
    .then(() => {
        console.log('Data simulation complete! All data displayed on the terminal.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error during data simulation:', err);
        mongoose.connection.close();
    });