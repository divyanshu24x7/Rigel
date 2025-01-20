import mongoose from "mongoose";

const userMessageSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "A message must have at least one tag.",
      },
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['unread', 'replied', 'in pool'],
      default: 'in pool',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastActionAt: {
      type: Date,
      default: null,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isInPool: {
      type: Boolean,
      default: true,
    },
  });

  export default mongoose.model("UserMessage",userMessageSchema)