import express from "express";
import MessageController from "../controllers/message.ct.js";
import UserController from "../controllers/user.ct.js";

const router = express.Router();


router.get("/user-list", UserController.getUserList);
router.post("/create-user", UserController.createUser);
router.post("/create-chat-room", UserController.createChatRoom);
router.delete("/delete-all-users", UserController.deleteAllUsers);
router.get("/chat-history/:roomId", MessageController.getChatHistory);
router.post("/send-message", MessageController.sendMessage);

export default router;
