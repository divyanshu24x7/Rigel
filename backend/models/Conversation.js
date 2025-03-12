// models/Conversation.js
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    ],
    // Optional field to display conversation preview info
    lastMessage: {
      content: { type: String },
      timestamp: { type: Date }
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
