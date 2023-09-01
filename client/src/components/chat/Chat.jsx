import React, { useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import {
  SearchOutlined,
  AttachFile,
  MoreVert,
  InsertEmoticon,
  Mic,
} from "@mui/icons-material";

const Chat = ({ chatHistory, currentUser, onSendMessage }) => {
  const [message, setMessage] = useState("");
  function handleSendMessage(event) {
    event.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  }
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>Room ID</h3>
          <p>{currentUser.roomId}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {chatHistory.map((message, index) => (
          <p
            key={message.senderId + "-" + index}
            className={`chat__message ${
              message.senderId === currentUser?._id ? "chat__sender" : ""
            }`}
          >
            <span className="chat__name">
              {message.senderId === currentUser?._id
                ? "You"
                : message.senderUsername}
            </span>{" "}
            {message.text}
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={handleSendMessage} type="submit">
            Send a message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
};

export default Chat;
