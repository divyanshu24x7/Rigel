import React, { useState } from 'react';
import profilepic from '../assets/profile-pic.png';
import HomeIcon from '@mui/icons-material/Home';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const Left = () => {
    const [activeMenu, setActiveMenu] = useState('Home');

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    return (
        <div className="left">
            <a className="profile">
                <div className="profile-photo">
                    <img src={profilepic} alt="Profile" />
                </div>
                <div className="handle">
                    <h4>Cat</h4>
                    <p className="text-muted">
                        @cat
                    </p>
                </div>
            </a>

            <div className="sidebar">
                <a 
                    className={`menu-item ${activeMenu === 'Home' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('Home')}
                >
                    <span className="ml-4"><HomeIcon /></span>
                    <h3>Home</h3>
                </a>
                <a 
                    className={`menu-item ${activeMenu === 'About' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('About')}
                >
                    <span className="ml-4"><InfoOutlinedIcon /></span>
                    <h3>About</h3>
                </a>
                <a 
                    className={`menu-item ${activeMenu === 'Messages' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('Messages')}
                    id="messages-notifications"
                >
                    <span className="ml-4"><EmailOutlinedIcon /></span>
                    <h3>Messages</h3>
                </a>
                <a 
                    className={`menu-item ${activeMenu === 'Profile' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('Profile')}
                >
                    <span className="ml-4"><Person2OutlinedIcon /></span>
                    <h3>Profile</h3>
                </a>
                <a 
                    className={`menu-item ${activeMenu === 'Tags' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('Tags')}
                >
                    <span className="ml-4"><BookmarkBorderOutlinedIcon /></span>
                    <h3>Tags</h3>
                </a>
            </div>
            <label className="btn btn-primary" htmlFor="create-post">Create Post</label>
        </div>
    );
};

export default Left;
