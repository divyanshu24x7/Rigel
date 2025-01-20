import React, { useState } from 'react';
import profilepic from '../assets/profile-pic.png';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const Compose = () => {
    const [message, setMessage] = useState("");
    const [tags, setTags] = useState(""); // New state for tags

    const handleInputChange = (event) => {
        setMessage(event.target.value);

        // Dynamically adjust the height of the textarea
        event.target.style.height = "auto"; // Reset height to auto
        event.target.style.height = `${event.target.scrollHeight}px`; // Adjust height based on content
    };

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    };

    const handlePost = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage

            const data = {
                content: message,
                tags: tags.split(",").map(tag => tag.trim()), // Convert comma-separated tags into an array
            };

            // Send the message to the backend using fetch
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
                setTags("");
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
                </div>
            </div>
            <div className='text-white flex justify-between items-center px-8 border-b border-gray-500 border-opacity-30 pb-4'>
                <BookmarkBorderOutlinedIcon className="ml-14" />
                <input
                    type="text"
                    value={tags}
                    onChange={handleTagsChange}
                    placeholder="Add tags, separated by commas"
                    className="text-xl text-gray-700 bg-rigelBlack outline-none w-1/3 mr-4 grow"
                />
                <button
                    className="text-gray-700 bg-rigelSalmon w-14 h-8 flex items-center justify-center border rounded-full"
                    onClick={handlePost}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default Compose;
