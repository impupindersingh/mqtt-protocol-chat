import User from "../models/user.js";
import crypto from "crypto";
import mqttConfig from "../utils/mqtt.js";
const mqttClient = mqttConfig.getClient();

export default {
  getUserList,
  createUser,
  createChatRoom,
  deleteAllUsers,
};

function generateChatRoomId(userId1, userId2) {
  const sortedUserIds = [userId1, userId2].sort();
  const combinedIds = sortedUserIds.join("");
  const hash = crypto.createHash("md5").update(combinedIds).digest("hex");
  return hash;
}

async function getUserList(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createUser(req, res) {
  try {
    const { username } = req.body;
    const newUser = new User({ username });
    await newUser.save();

    const updatedUsers = await User.find({});
    mqttClient.publish("user-list", JSON.stringify(updatedUsers));

    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate error
      return res.status(400).json({ message: "Username is already taken." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createChatRoom(req, res) {
  try {
    const { userId1, userId2 } = req.body;
    const roomId = generateChatRoomId(userId1, userId2);
    res.status(201).json({ roomId });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteAllUsers(req, res) {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users have been deleted." });
    mqttClient.publish("user-list", JSON.stringify([]));
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}
