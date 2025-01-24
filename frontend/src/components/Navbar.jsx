import React from "react";
import profilepic from '../assets/profile-pic.png';
import SearchIcon from '@mui/icons-material/Search';
const Navbar = () => {
    const handleSignOut = ()=>{
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
    }
  return (
    <div className="container">
            <h2 className="logo text-3xl">
                Rigel
            </h2>
            <div className="search-bar">
                <SearchIcon />
                <input type="search" placeholder="Search htmlFor creators, inspirations, and projects" />
            </div>
            <div className="create">
                <label className="btn btn-primary" htmlFor="create-post"
                onClick={()=>handleSignOut()}>
                    Sign out</label>
                <div className="profile-photo">
                    <img src={profilepic} alt="" />
                </div>
            </div>
        </div>
  );
};

export default Navbar;
