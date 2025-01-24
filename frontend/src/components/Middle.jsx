import React from 'react';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import profilepic from '../assets/profile-pic.png';

const Middle = () => {
    return (
        <div class="middle">
                <form action="" class="create-post">
                    <div class="profile-photo">
                        <img src={profilepic} />
                    </div>
                    <input type="text" placeholder="What's on your mind, Diana ?" id="create-post" />
                    <input type="submit" value="Post" class="btn btn-primary" />
                </form>
                <div class="feeds">
                    <div class="feed">
                        <div class="head">
                            <div class="user">
                                <div class="profile-photo">
                                    <img src={profilepic} />
                                </div>
                                <div class="info">
                                    <h3>Cat</h3>
                                    <small>Dubai, 15 Minutes Ago</small>
                                </div>
                            </div>
                        </div>

                        <div class="photo">
                            <img src={profilepic} />
                        </div>

                        <div class="action-buttons">
                            <div class="interaction-buttons">
                                <span><BookmarkBorderOutlinedIcon /></span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
    );
};

export default Middle;
