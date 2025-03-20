// ProfileComponent.jsx
import React, { useEffect, useState } from "react";

const ProfileComponent = () => {
  const [profilePicture, setProfilePicture] = useState("profilePicture");
  const [username, setUsername] = useState("Loading...");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [bioEdited, setBioEdited] = useState(false);
  const [usernameEdited, setUsernameEdited] = useState(false);

  useEffect(() => {
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
          setUsername(data.username || "Anonymous");
          setBio(data.bio || "(Add a bio, so others can know more about you!)");
          setProfilePicture(data.profilePicture);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePicture(URL.createObjectURL(file));
      setShowSaveButton(true);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/upload-profile-pic", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.profilePicture);
        setShowSaveButton(false);
        alert("Profile picture updated!");
      } else {
        console.error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleBioSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });
      if (response.ok) {
        const data = await response.json();
        alert("Bio updated successfully!");
        setBio(data.bio); // Optionally update bio with response data
        setBioEdited(false);
      } else {
        console.error("Failed to update bio");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleUsernameSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/profile/username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        const data = await response.json();
        alert("Username updated successfully!");
        setUsername(data.username);
        setUsernameEdited(false);
      } else if (response.status === 409) {
        const errorData = await response.json();
        alert(errorData.error || "Username already exists");
      } else {
        console.error("Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  return (
    <div className="middle p-4">
      <div className="feeds flex flex-col gap-4">
        <div className="feed">
          <div className="p-4 border rounded-xl">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>

            {/* Profile Picture */}
            <div className="mb-4">
              <img
                src={`http://localhost:5000${profilePicture}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-2"
              />
              <input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={handleImageChange}
              />
              {showSaveButton && (
                <button
                  onClick={handleImageUpload}
                  className="p-2 bg-green-500 text-white rounded-md mt-2"
                >
                  Save
                </button>
              )}
            </div>

            {/* Username */}
            <div className="mb-4">
              <h3 className="font-semibold">Username:</h3>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameEdited(true);
                }}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              {usernameEdited && (
                <button
                  onClick={handleUsernameSave}
                  className="p-2 bg-green-500 text-white rounded-md mt-2"
                >
                  Save Username
                </button>
              )}
            </div>

            {/* Bio */}
            <div className="mb-4">
              <h3 className="font-semibold">Bio:</h3>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setBioEdited(true);
                }}
                rows="4"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
              {bioEdited && (
                <button
                  onClick={handleBioSave}
                  className="p-2 bg-green-500 text-white rounded-md mt-2"
                >
                  Save Bio
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
