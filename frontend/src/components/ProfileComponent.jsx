// ProfileComponent.jsx
import React, { useEffect, useState } from "react";

const ProfileComponent = () => {
  const [profilePicture, setProfilePicture] = useState("profilePicture");
  const [username, setUsername] = useState("Loading...");
  const [bio, setBio] = useState("");
  const [preferredTags, setPreferredTags] = useState([]);
  const [notPreferredTags, setNotPreferredTags] = useState([]);
  // We create separate search inputs for the two tag sections.
  const [preferredTagInput, setPreferredTagInput] = useState("");
  const [notPreferredTagInput, setNotPreferredTagInput] = useState("");
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
          setPreferredTags(data.preferredTags || []);
          setNotPreferredTags(data.notPreferredTags || []);
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

  // Helper function to update both tag arrays on the server
  const updateTags = async (newPreferredTags, newNotPreferredTags) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/profile/tags", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          preferredTags: newPreferredTags,
          notPreferredTags: newNotPreferredTags,
        }),
      });
      if (!response.ok) {
        console.error("Error updating tags");
      }
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  // Preferred tags: add and remove
  const handlePreferredTagAdd = () => {
    if (
      preferredTagInput &&
      !preferredTags.includes(preferredTagInput.trim())
    ) {
      const newPreferredTags = [...preferredTags, preferredTagInput.trim()];
      setPreferredTags(newPreferredTags);
      setPreferredTagInput("");
      // Update the database with the new preferred tags array
      updateTags(newPreferredTags, notPreferredTags);
    }
  };

  const handlePreferredTagRemove = (tag) => {
    const newPreferredTags = preferredTags.filter((t) => t !== tag);
    setPreferredTags(newPreferredTags);
    updateTags(newPreferredTags, notPreferredTags);
  };

  // Not preferred tags: add and remove
  const handleNotPreferredTagAdd = () => {
    if (
      notPreferredTagInput &&
      !notPreferredTags.includes(notPreferredTagInput.trim())
    ) {
      const newNotPreferredTags = [
        ...notPreferredTags,
        notPreferredTagInput.trim(),
      ];
      setNotPreferredTags(newNotPreferredTags);
      setNotPreferredTagInput("");
      updateTags(preferredTags, newNotPreferredTags);
    }
  };

  const handleNotPreferredTagRemove = (tag) => {
    const newNotPreferredTags = notPreferredTags.filter((t) => t !== tag);
    setNotPreferredTags(newNotPreferredTags);
    updateTags(preferredTags, newNotPreferredTags);
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

            {/* Preferred Tags */}
            <div className="mb-4">
              <h3 className="font-semibold">Preferred Tags:</h3>
              {/* Only display tag bubbles if there are tags */}
              {preferredTags.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {preferredTags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-blue-200 text-blue-800 rounded-full px-4 py-1 flex items-center"
                    >
                      {tag}
                      <button
                        className="ml-2 text-sm font-bold text-red-500"
                        onClick={() => handlePreferredTagRemove(tag)}
                      >
                        &#x2715;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <input
                  value={preferredTagInput}
                  placeholder="Add a preferred tag..."
                  onChange={(e) => setPreferredTagInput(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md flex-1"
                />
                <button
                  onClick={handlePreferredTagAdd}
                  className="p-2 bg-blue-500 text-white rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Not Preferred Tags */}
            <div className="mb-4">
              <h3 className="font-semibold">Not Preferred Tags:</h3>
              {notPreferredTags.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {notPreferredTags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-red-200 text-red-800 rounded-full px-4 py-1 flex items-center"
                    >
                      {tag}
                      <button
                        className="ml-2 text-sm font-bold text-red-500"
                        onClick={() => handleNotPreferredTagRemove(tag)}
                      >
                        &#x2715;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <input
                  value={notPreferredTagInput}
                  placeholder="Add a not preferred tag..."
                  onChange={(e) => setNotPreferredTagInput(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md flex-1"
                />
                <button
                  onClick={handleNotPreferredTagAdd}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
