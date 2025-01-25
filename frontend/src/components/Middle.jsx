import React, { useState } from 'react';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import profilepic from '../assets/profile-pic.png';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';

const Middle = () => {
    const [inputText, setInputText] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    const handleInput = (event) => {
        const maxLength = 500;
        const value = event.target.value;
        if (value.length <= maxLength) {
            setInputText(value);
            event.target.style.height = 'auto'; // Reset height to calculate new height
            event.target.style.height = `${event.target.scrollHeight}px`; // Set height based on content
        }
    };

    const handleTagInput = (event) => {
        setTagInput(event.target.value);
    };

    const handleTagKeyDown = (event) => {
        if (event.key === ',' || event.key === 'Enter') {
            event.preventDefault();
            const tag = tagInput.trim();
            if (tag && !tags.includes(tag)) {
                setTags([...tags, tag]);
                setTagInput('');
            }
        }
    };

    const handleTagRemove = (index) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const remainingChars = 500 - inputText.length;

    const handlePost = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // This tells the server to expect JSON data
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: inputText, tags: tags }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setInputText('');
                setTags([]);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="middle">
            <form action="" className="create-post" onSubmit={handlePost}>
                <div className="flex items-start gap-4 w-full">
                    <div className="profile-photo">
                        <img src={profilepic} alt="Profile" />
                    </div>
                    <div className="w-full">
                        <textarea
                            placeholder="Write here.."
                            id="create-post"
                            rows="1"
                            style={{ resize: 'none', overflow: 'hidden' }}
                            value={inputText}
                            onInput={handleInput}
                            className="w-full mt-4 border-b-2 border-gray-300 px-3 py-2"
                        />
                        <div className='flex flex-col'>
                            <div className='flex items-center'>
                            <span>
                                {/* Attachment Icon from Material-UI */}
                                <AttachmentOutlinedIcon className="mr-2 cursor-pointer" />
                            </span>
                                <span><BookmarkBorderOutlinedIcon /></span>
                                <input
                                    type="text"
                                    id="tags"
                                    placeholder="Type tags seperated by comma"
                                    className="w-full border-b-2 border-gray-300  px-3 py-2 "
                                    value={tagInput}
                                    onChange={handleTagInput}
                                    onKeyDown={handleTagKeyDown}
                                />

                                <div className="flex flex-col items-center justify-center mt-4">
                                    <input type="submit" value="Post" className="btn btn-primary" />
                                    <small
                                        className={`block mt-1 text-sm ${remainingChars <= 50 ? 'text-red-500' : 'text-gray-500'
                                            }`}
                                    >
                                        {remainingChars} chars left
                                    </small>
                                </div>

                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                            onClick={() => handleTagRemove(index)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </form>

            <div className="feeds">
                <div className="feed">
                    <div className="head">
                        <div className="user">
                            <div className="profile-photo">
                                <img src={profilepic} alt="Feed Profile" />
                            </div>
                            <div className="info">
                                <h3>Cat</h3>
                                <small>Dubai, 15 Minutes Ago</small>
                            </div>
                        </div>
                    </div>
                    <div className="photo">
                        <img src={profilepic} alt="Feed Content" />
                    </div>
                    <div className="action-buttons">
                        <div className="interaction-buttons">
                            <span>
                                <BookmarkBorderOutlinedIcon />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Middle;
