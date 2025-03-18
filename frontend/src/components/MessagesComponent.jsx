import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Establish a socket connection (using WebSocket transport only)
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const MessagesComponent = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("http://localhost:5000/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
          if (data.length > 0) {
            setSelectedConversation(data[0]);
          }
        } else {
          console.error("Failed to fetch conversations");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  // Fetch chats when a conversation is selected
  useEffect(() => {
    const fetchChats = async () => {
      if (!selectedConversation) return;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://localhost:5000/conversations/${selectedConversation._id}/chats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setChats(data);
        } else {
          console.error("Failed to fetch chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [selectedConversation]);

  // Join and leave a conversation room based on selection
  useEffect(() => {
    if (selectedConversation) {
      socket.emit("joinConversation", selectedConversation._id);
    }
    return () => {
      if (selectedConversation) {
        socket.emit("leaveConversation", selectedConversation._id);
      }
    };
  }, [selectedConversation]);

  // Listen for new messages via Socket.IO
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (
        selectedConversation &&
        message.conversationId === selectedConversation._id
      ) {
        setChats((prevChats) => [...prevChats, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedConversation]);

  const handleConversationClick = (conv) => {
    setSelectedConversation(conv);
  };

  // Handle sending a new message via HTTP
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5000/conversations/${selectedConversation._id}/chats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage.trim() }),
        }
      );
      if (response.ok) {
        setNewMessage("");
      } else {
        const errorData = await response.json();
        console.error("Error sending message:", errorData);
        alert(errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Assume currentUserId is stored in local storage
  const currentUserId = localStorage.getItem("userId");

  return (
    <div className="middle">
      <div className="feeds">
        <div className="feed">
          {/* 
            Use flex-col on small screens, switch to flex-row on md (768px) and above.
            Remove h-screen to let content grow naturally on mobile. 
          */}
          <div className="flex flex-col md:flex-row md:h-screen">
            {/* Left Sidebar: Conversations List */}
            <div className="md:w-1/3 w-full border-r border-gray-300 p-4 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Chats</h2>
              {conversations.length === 0 ? (
                <p className="text-gray-500">No conversations yet.</p>
              ) : (
                <ul>
                  {conversations.map((conv) => {
                    // Identify the other participant
                    const otherUser = conv.participants.find(
                      (p) => p._id.toString() !== currentUserId
                    );
                    return (
                      <li
                        key={conv._id}
                        className={`flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-2 ${
                          selectedConversation &&
                          selectedConversation._id === conv._id
                            ? "bg-gray-200"
                            : ""
                        }`}
                        onClick={() => handleConversationClick(conv)}
                      >
                        <img
                          src={
                            otherUser && otherUser.profilePic
                              ? `http://localhost:5000${otherUser.profilePic}`
                              : "https://via.placeholder.com/40"
                          }
                          alt="User"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-bold">
                            {otherUser ? otherUser.username : "Unknown"}
                          </p>
                          {conv.lastMessage && (
                            <p className="text-sm text-gray-500">
                              {conv.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Right Section: Chat Conversation */}
            <div className="flex flex-col md:w-2/3 w-full p-4">
              {selectedConversation ? (
                <>
                  <div className="flex-1 overflow-y-auto mb-4">
                    {chats.length === 0 ? (
                      <p className="text-gray-500">
                        No messages in this conversation.
                      </p>
                    ) : (
                      chats.map((chat) => (
                        <div
                          key={chat._id}
                          className={`mb-4 flex ${
                            chat.sender === currentUserId
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {/* 
                            Make chat bubbles max-w-full and enable break-words 
                            to avoid horizontal overflow on small screens.
                          */}
                          <div
                            className={`p-3 rounded-lg max-w-full break-words ${
                              chat.sender === currentUserId
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                            }`}
                          >
                            {chat.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Chat Input */}
                  <div className="border-t border-gray-300 pt-3 flex">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="ml-2 p-3 bg-blue-500 text-white rounded-lg"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p>Select a conversation to start chatting.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesComponent;
