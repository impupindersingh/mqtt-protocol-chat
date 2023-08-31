import Message from "../models/message.js";

async function getChatHistory(req, res) {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).populate("senderId").lean();
    // Transform the senderId to just the _id value
    const transformedMessages = messages.map((message) => {
      return {
        ...message,
        senderId: message.senderId._id,
      };
    });
    res.status(200).json(transformedMessages);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function sendMessage(req, res) {
  try {
    const { roomId, text, senderId, senderUsername } = req.body;
    const newMessage = new Message({
      roomId,
      text,
      senderId,
      senderUsername,
      timestamp: new Date(),
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occured while sending the message." });
  }
}

export default {
  getChatHistory,
  sendMessage,
};
