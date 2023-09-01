import React from "react";
import "./Sidebar.css";
import SidebarChat from "../sidebar-chat/SidebarChat";
import {
  DonutLarge,
  Chat,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";

const Sidebar = ({ userList, onSelectUser }) => {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src="https://avatars.githubusercontent.com/u/108086688?v=4" />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        {userList.map((user, index) => (
          <SidebarChat
          key={user + "-" + index}
            user={user}
            onSelectUser={onSelectUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
