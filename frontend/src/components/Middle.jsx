import React from 'react';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import profilepic from '../assets/profile-pic.png';

const Middle = () => {
    const handleInput = (event) => {
        event.target.style.height = 'auto'; // Reset height to calculate new height
        event.target.style.height = `${event.target.scrollHeight}px`; // Set height based on content
    };
    
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
                    onInput={(event)=>{handleInput(event)}}
                />
                <input type="submit" value="Post" className="btn btn-primary" />
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
