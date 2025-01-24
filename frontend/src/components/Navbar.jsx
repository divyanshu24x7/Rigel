import React from "react";
import profilepic from '../assets/profile-pic.png';
import SearchIcon from '@mui/icons-material/Search';
const Navbar = () => {
  return (
    <div className="container">
            <h2 className="logo text-3xl">
                Rigel
            </h2>
            <div className="search-bar">
                <SearchIcon />
                <input type="search" placeholder="Search for creators, inspirations, and projects" />
            </div>
            <div className="create">
                <label className="btn btn-primary" for="create-post">Create</label>
                <div className="profile-photo">
                    <img src={profilepic} alt="" />
                </div>
            </div>
        </div>
  );
};

export default Navbar;
