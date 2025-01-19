import React, { useState } from 'react';
import profilepic from '../assets/profile-pic.png';

const Compose = () => {
  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    setMessage(event.target.value);

    // Dynamically adjust the height of the textarea
    event.target.style.height = "auto"; // Reset height to auto
    event.target.style.height = `${event.target.scrollHeight}px`; // Adjust height based on content
  };

  return (
    <div className="flex h-1/2">
      <img
        src={profilepic}
        alt=""
        className="block w-14 h-14 border rounded-full m-4"
      />
      <div className="w-4/5 h-auto">
        <textarea
          value={message}
          onChange={handleInputChange}
          placeholder="Write a message"
          className="text-2xl text-gray-700 bg-rigelBlack outline-none w-full mt-6 resize-none overflow-hidden border-b border-gray-500 border-opacity-30"
          rows="2" // Initial number of rows
        />
      </div>
    </div>
  );
};

export default Compose;
