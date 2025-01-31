import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
const Navbar = () => {
  const [profilePicture, setProfilePicture] = useState("profilePicture");
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    navigate("/auth/login");
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profilePicture);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="container">
      <h2 className="logo text-3xl">Rigel</h2>
      <div className="search-bar">
        <SearchIcon />
        <input type="search" placeholder="Search for tags" />
      </div>
      <div className="create">
        <label
          className="btn btn-primary"
          htmlFor="create-post"
          onClick={() => handleSignOut()}
        >
          Sign out
        </label>
        <div className="profile-photo">
          <img src={`http://localhost:5000${profilePicture}`} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
