// MessagesComponent.jsx
import React from "react";

const MessagesComponent = () => {
  return (
    <div className="middle p-4">
      <div className="feeds flex flex-col gap-4">
        <div className="feed">
          <div className="flex h-screen">
            {/* Left Sidebar - Chat List */}
            <div className="w-1/3 border-r border-gray-300 p-4">
              <h2 className="text-2xl font-bold mb-4">Chats</h2>
              <ul>
                <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold">John Doe</p>
                    <p className="text-sm text-gray-500">Hey, how are you?</p>
                  </div>
                </li>
                <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold">Jane Smith</p>
                    <p className="text-sm text-gray-500">
                      Let's catch up soon!
                    </p>
                  </div>
                </li>
                <li className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold">Bob Johnson</p>
                    <p className="text-sm text-gray-500">
                      Check out this cool link
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Section - Chat Conversation */}
            <div className="flex flex-col w-2/3 p-4">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="mb-4 flex">
                  <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                    Hi there!
                  </div>
                </div>
                <div className="mb-4 flex justify-end">
                  <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                    Hello! How can I help you today?
                  </div>
                </div>
                <div className="mb-4 flex">
                  <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                    I'm looking for more information on your product.
                  </div>
                </div>
                <div className="mb-4 flex justify-end">
                  <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                    Sure, let me send you a link.
                  </div>
                </div>
              </div>
              {/* Chat Input */}
              <div className="border-t border-gray-300 pt-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesComponent;
