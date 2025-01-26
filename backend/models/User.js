import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String, // URL or path to the profile picture
        default: "/profile_pics/default.jpg", // Default profile picture path
    },
    bio: {
        type: String, // Short user bio
        maxlength: 500, // Optional character limit for the bio
    },
    preferredTags: {
        type: [String], // Array of tag names
        default: [], // Default is an empty array
        validate: {
            validator: function (v) {
                return Array.isArray(v); // Ensure it's an array
            },
            message: "Preferred tags must be an array of strings.",
        },
    },
    notPreferredTags: {
        type: [String], // Array of tag names for tags the user doesn't want
        default: [], // Default is an empty array
        validate: {
            validator: function (v) {
                return Array.isArray(v); // Ensure it's an array
            },
            message: "Not preferred tags must be an array of strings.",
        },
    },
    totalPosts: {
        type: Number, // Tracks the number of posts by the user
        default: 0, // Default to 0
        min: 0, // Ensure the number of posts can't be negative
    },
});

module.exports = mongoose.model("User", UserSchema);
