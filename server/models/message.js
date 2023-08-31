import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: { type: String },
  text: { type: String },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  senderUsername: { type: String },
  timestamp: { type: Date, default: Date.now },
});
const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
