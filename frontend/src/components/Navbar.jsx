import React from "react";
import { useNavigate } from 'react-router-dom';
import profilepic from '../assets/profile-pic.png';
import SearchIcon from '@mui/icons-material/Search';
const Navbar = () => {
    const navigate = useNavigate()
    const handleSignOut = ()=>{
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        navigate('/auth/login')
    }
  return (
    <div className="container">
            <h2 className="logo text-3xl">
                Rigel
            </h2>
            <div className="search-bar">
                <SearchIcon />
                <input type="search" placeholder="Search for tags" />
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
