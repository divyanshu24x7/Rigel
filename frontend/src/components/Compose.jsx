import React, { useState } from 'react';
import profilepic from '../assets/profile-pic.png';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const Compose = () => {
    const [message, setMessage] = useState("");

    const handleInputChange = (event) => {
        setMessage(event.target.value);

        // Dynamically adjust the height of the textarea
        event.target.style.height = "auto"; // Reset height to auto
        event.target.style.height = `${event.target.scrollHeight}px`; // Adjust height based on content
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
                        rows="2" // Initial number of rows
                    />
                </div>
            </div>
            <div className='text-white flex justify-between items-center px-8 border-b border-gray-500 border-opacity-30 pb-4'>
                <BookmarkBorderOutlinedIcon className="ml-14" /> {/* Add margin-right to slightly move it to the right */}
                <button
                    className="text-gray-700 bg-rigelSalmon w-14 h-8 flex items-center justify-center border rounded-full"
                    onClick={() => console.log("Post clicked")}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default Compose;
