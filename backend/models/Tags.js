import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  frequency: {
    type: Number,
    default: 0, // Tracks how many times the tag has been used
  },
  createdAt: {
    type: Date,
    default: Date.now, // When the tag was first created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Updated whenever the frequency changes
  },
  lastUsed: {
    type: Date,
    default: Date.now, // Tracks the last time the tag was used
  },
  isTrending: {
    type: Boolean,
    default: false, // Boolean flag to mark trending tags
  },
});

// Create an index on frequency for fast sorting
tagSchema.index({ frequency: -1 });

// Middleware to update timestamps
tagSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Automatically update `updatedAt`
  if (this.isModified("frequency")) {
    this.lastUsed = Date.now(); // Update `lastUsed` if frequency changes
  }
  next();
});

// const Tag = mongoose.model('Tag', tagSchema);

// module.exports = Tag;

export default mongoose.model("Tags", tagSchema);
