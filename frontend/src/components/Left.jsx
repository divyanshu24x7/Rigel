import React from 'react';
import profilepic from '../assets/profile-pic.png';
import HomeIcon from '@mui/icons-material/Home';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const Left = () => {
    return (
        <div class="left">
            <a class="profile">
                <div class="profile-photo">
                    <img src={profilepic} />
                </div>
                <div class="handle">
                    <h4>Cat</h4>
                    <p class="text-muted">
                        @cat
                    </p>
                </div>
            </a>

            <div class="sidebar">
                <a class="menu-item active">
                    <span className='ml-4'> <HomeIcon /> </span>
                    <h3>Home</h3>
                </a>
                <a class="menu-item">
                    <span className='ml-4'><InfoOutlinedIcon /></span>
                    <h3>About</h3>
                </a>
                <a class="menu-item" id="messages-notifications">
                    <span className='ml-4'><EmailOutlinedIcon /></span>
                    <h3>Messages</h3>
                </a>
                <a class="menu-item">
                    <span className='ml-4'> <Person2OutlinedIcon /></span>
                    <h3>Profile</h3>
                </a>
                <a class="menu-item">
                    <span  className='ml-4'><BookmarkBorderOutlinedIcon /></span>
                    <h3>Tags</h3>
                </a>
            </div>
            <label class="btn btn-primary" for="create-post">Create Post</label>
        </div>
    );
};

export default Left;
