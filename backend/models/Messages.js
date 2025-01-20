import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true, // Removes extra spaces
    },
    tags: {
        type: [String], // Array of strings
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0; // Ensure at least one tag is provided
            },
            message: "A message must have at least one tag.",
        },
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a User
        required: true,
        ref: 'User', // Assuming a 'User' model exists
    },
    status: {
        type: String,
        enum: ['unread', 'replied', 'in pool'], // Valid statuses
        default: 'in pool',
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date
    },
    lastActionAt: {
        type: Date,
        default: null, // Can be updated upon actions like reply or skip
    },
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the replier
        ref: 'User', // Assuming a 'User' model exists
        default: null,
    },
    isInPool: {
        type: Boolean,
        default: true, // Indicates if the message is available for delivery
    },
});

// Add an index for optimizing searches on tags and pool status
messageSchema.index({ tags: 1, isInPool: 1 });

export default mongoose.model("Messages", messageSchema)