import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Chat from "./components/chat/Chat";
import axios from "./helpers/axios";
import mqtt from "mqtt/dist/mqtt";
import "./App.css";
import Button from "@mui/material/Button";

const MQTT_BROKER_URL = "wss://broker.emqx.io:8084/mqtt";

function App() {
  const [mqttClient, setMqttClient] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Subscribe to the chat room topic when it's available
    if (mqttClient && selectedUser && selectedUser.roomId) {
      mqttClient.subscribe(selectedUser.roomId);
    }
  }, [mqttClient, selectedUser]);

  useEffect(() => {
    if (isRegistered) {
      fetchUserList();

      const client = mqtt.connect(MQTT_BROKER_URL);
      setMqttClient(client);

      client.on("connect", () => {
        client.subscribe("user-list");
      });

      client.on("message", (topic, message) => {
        if (topic === "user-list") {
          const updatedUserList = JSON.parse(message);
          setUserList(updatedUserList);
        } else if (
          selectedUser &&
          selectedUser.roomId &&
          topic === selectedUser.roomId
        ) {
          const incomingMessage = JSON.parse(message);
          setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            incomingMessage,
          ]);
        }
      });

      return () => {
        client.end();
      };
    }
  }, [isRegistered, selectedUser]);

  // Fetch user list
  const fetchUserList = async () => {
    try {
      const response = await axios.get("/api/user-list");
      setUserList(response.data);
    } catch (err) {
      console.error("Error fetching user list: ", err);
    }
  };

  // Register user
  const registerUser = async () => {
    const username = prompt("Enter your username:");
    if (username) {
      try {
        const response = await axios.post("/api/create-user", { username });
        setSelectedUser(response.data);
        setIsRegistered(true);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          alert(
            "Username is already taken. Please choose a different username."
          );
        } else {
          console.error("Error registering user:", err);
        }
      }
    }
  };

  // Fetch chat history
  const fetchChatHistory = async (roomId) => {
    try {
      const response = await axios.get(`/api/chat-history/${roomId}`);
      setChatHistory(response.data);
    } catch (err) {
      console.error("Error fetching chat history: ", err);
    }
  };

  // Handle select user
  const handleSelectUser = async (user) => {
    if (!selectedUser) {
      setSelectedUser(user);
      setIsChatOpen(true);
    } else if (selectedUser._id !== user._id) {
      try {
        const response = await axios.post("/api/create-chat-room", {
          userId1: selectedUser._id,
          userId2: user._id,
        });
        const { roomId } = response.data;
        setSelectedUser((prevUser) => ({
          ...prevUser,
          roomId: roomId,
        }));
        setIsChatOpen(true);
        fetchChatHistory(roomId);
      } catch (err) {
        console.error("Error creating chat room:", err);
      }
    }
  };

  // Handle send message
  const handleSendMessage = async (messageText) => {
    if (!selectedUser) return;
    const data = {
      roomId: selectedUser.roomId,
      text: messageText,
      senderId: selectedUser._id,
      senderUsername: selectedUser.username,
    };

    try {
      const response = await axios.post("/api/send-message", data);
      // Check if the message sender is the current user
      const isCurrentUserMessage = selectedUser._id === response.data.senderId;
      // Only add the message to chat history if it's not from current user, to get rid of duplicate messages
      if (!isCurrentUserMessage) {
        setChatHistory([...chatHistory, response.data]);
      }
      // Publish to chat room topic
      mqttClient.publish(selectedUser.roomId, JSON.stringify(data));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    const gradientBackground =
      "background: linear-gradient(to right, #ff6b6b, #0077b6);";
    const fontColor = "color: white;";
    const fontSize = "font-size: 18px;";
    const padding = "padding: 8px;";
    const borderRadius = "border-radius: 4px;";

    console.log(
      "%c Made with ❤ by Ashish ",
      gradientBackground + fontColor + fontSize + padding + borderRadius
    );
  }, []);

  return (
    <div className="app">
      {!isRegistered ? (
        <Button onClick={registerUser} variant="contained">
          Register User
        </Button>
      ) : (
        <div className="app__body">
          <Sidebar
            userList={userList.filter((user) => user._id !== selectedUser?._id)}
            onSelectUser={handleSelectUser}
          />
          {selectedUser && isChatOpen && (
            <Chat
              chatHistory={chatHistory}
              currentUser={selectedUser}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
