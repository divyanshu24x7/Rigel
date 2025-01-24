import React, { useState } from 'react';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import profilepic from '../assets/profile-pic.png';

const Middle = () => {
    const [inputText, setInputText] = useState('')
    const handleInput = (event) => {
        const maxLength = 500
        const value = event.target.value
        if (value.length <= maxLength) {
            setInputText(value)
            event.target.style.height = 'auto'; // Reset height to calculate new height
            event.target.style.height = `${event.target.scrollHeight}px`; // Set height based on content
        }

    };

    const remainingChars = 500 - inputText.length

    return (
        <div className="middle">
            <form action="" className="create-post">
                <div className="profile-photo">
                    <img src={profilepic} />
                </div>
                {/* <input type="text" placeholder="What's on your mind, Diana ?" id="create-post" /> */}
                <textarea
                    placeholder="Write here.."
                    id="create-post"
                    rows="1"
                    style={{ resize: 'none', overflow: 'hidden' }}
                    value={inputText}
                    onInput={(event) => { handleInput(event) }}
                />
                <div className='flex flex-col items-center justify-center'>
                    <input type="submit" value="Post" className="btn btn-primary" />
                    <small
                        className={`block mt-1 text-sm ${remainingChars <= 50
                            ? 'text-red-500' // Red color for <50 characters left
                            : 'text-gray-500' // Gray color otherwise
                            }`}
                    >
                        {remainingChars} chars left
                    </small>
                </div>
            </form>
            <div className="feeds">
                <div className="feed">
                    <div className="head">
                        <div className="user">
                            <div className="profile-photo">
                                <img src={profilepic} />
                            </div>
                            <div className="info">
                                <h3>Cat</h3>
                                <small>Dubai, 15 Minutes Ago</small>
                            </div>
                        </div>
                    </div>

                    <div className="photo">
                        <img src={profilepic} />
                    </div>

                    <div className="action-buttons">
                        <div className="interaction-buttons">
                            <span><BookmarkBorderOutlinedIcon /></span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Middle;
