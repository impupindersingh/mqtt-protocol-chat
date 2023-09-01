import React from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";

const SidebarChat = ({ user, uniqueValue, onSelectUser }) => {
  return (
    <div
      key={uniqueValue}
      className="sidebarChat"
      onClick={() => onSelectUser(user)}
    >
      <Avatar />
      <div className="sidebarChat__info">
        <h2>{user.username}</h2>
      </div>
    </div>
  );
};

export default SidebarChat;
