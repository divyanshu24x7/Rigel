import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import profilepic from '../assets/profile-pic.png';
import HomeIcon from '@mui/icons-material/Home';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

const Left = () => {
    const location = useLocation();
    const activeMenu = location.pathname;

    return (
        <div className="left">
            <a className="profile">
                <div className="profile-photo">
                    <img src={profilepic} alt="Profile" />
                </div>
                <div className="handle">
                    <h4>Cat</h4>
                    <p className="text-muted">@cat</p>
                </div>
            </a>

            <div className="sidebar">
                <Link 
                    className={`menu-item ${activeMenu === '/' ? 'active' : ''}`} 
                    to="/"
                >
                    <span className="ml-4"><HomeIcon /></span>
                    <h3>Home</h3>
                </Link>
                <Link 
                    className={`menu-item ${activeMenu === '/about' ? 'active' : ''}`} 
                    to="/about"
                >
                    <span className="ml-4"><InfoOutlinedIcon /></span>
                    <h3>About</h3>
                </Link>
                <Link 
                    className={`menu-item ${activeMenu === '/messages' ? 'active' : ''}`} 
                    to="/messages"
                >
                    <span className="ml-4"><EmailOutlinedIcon /></span>
                    <h3>Messages</h3>
                </Link>
                <Link 
                    className={`menu-item ${activeMenu === '/profile' ? 'active' : ''}`} 
                    to="/profile"
                >
                    <span className="ml-4"><Person2OutlinedIcon /></span>
                    <h3>Profile</h3>
                </Link>
                <Link 
                    className={`menu-item ${activeMenu === '/tags' ? 'active' : ''}`} 
                    to="/tags"
                >
                    <span className="ml-4"><BookmarkBorderOutlinedIcon /></span>
                    <h3>Tags</h3>
                </Link>
            </div>
            <label className="btn btn-primary" htmlFor="create-post">Create Post</label>
        </div>
    );
};

export default Left;
