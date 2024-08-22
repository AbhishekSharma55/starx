import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt : {
    type: Date,
    default: Date.now,
  },
  content: [
    {
      role: {
        type: String,
        enum: ['user', 'bot'],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
});

const ChatModel = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default ChatModel;
