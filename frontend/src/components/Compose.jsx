import React, { useState } from 'react';
import profilepic from '../assets/profile-pic.png';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const CHARACTER_LIMIT = 600;

const Compose = () => {
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]); // Store tags as an array
  const [currentTag, setCurrentTag] = useState(""); // Current tag being typed
  const [remainingChars, setRemainingChars] = useState(CHARACTER_LIMIT);

  const handleInputChange = (event) => {
    const input = event.target.value;

    if (input.length <= CHARACTER_LIMIT) {
      setMessage(input);
      setRemainingChars(CHARACTER_LIMIT - input.length);
    }

    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleTagsChange = (event) => {
    setCurrentTag(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === ',' && currentTag.trim() !== "") {
      event.preventDefault(); // Prevent comma from adding to the input
      setTags((prevTags) => [...prevTags, currentTag.trim()]);
      setCurrentTag(""); // Reset current tag input
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePost = async () => {
    if (message.length > CHARACTER_LIMIT) {
      console.error("Message exceeds the character limit.");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');

      const data = {
        content: message,
        tags: tags,
      };

      const response = await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Message posted successfully:", responseData);
        setMessage("");
        setTags([]);
        setRemainingChars(CHARACTER_LIMIT); // Reset remaining characters
      } else {
        console.error("Failed to post message:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  return (
    <div>
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
            rows="2"
          />
          <div className="text-right text-sm text-gray-400">
            {remainingChars} characters remaining
          </div>
        </div>
      </div>
      <div className="text-white flex justify-between items-center px-8 border-b border-gray-500 border-opacity-30 pb-4">
        <BookmarkBorderOutlinedIcon className="ml-14" />
        
        {/* Tags Bubbles Section */}
        <div className="w-1/3 mr-4 grow">
          <div className="flex flex-wrap space-x-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-xs text-gray-400 hover:text-white ml-2"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          {/* Tag Input */}
          <input
            type="text"
            value={currentTag}
            onChange={handleTagsChange}
            onKeyDown={handleKeyDown}
            placeholder="Add tags, separated by commas"
            className="text-xl text-gray-700 bg-rigelBlack outline-none w-full grow"
          />
        </div>

        <button
          className="text-gray-700 bg-rigelSalmon w-14 h-8 flex items-center justify-center border rounded-full hover:bg-lightSalmon"
          onClick={handlePost}
          disabled={message.length === 0} // Disable if no message
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Compose;
