// ProfileComponent.jsx
import React, { useEffect, useState } from "react";

const ProfileComponent = () => {
  const [preferredTags, setPreferredTags] = useState([]);
  const [notPreferredTags, setNotPreferredTags] = useState([]);
  // We create separate search inputs for the two tag sections.
  const [preferredTagInput, setPreferredTagInput] = useState("");
  const [notPreferredTagInput, setNotPreferredTagInput] = useState("");

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
          setPreferredTags(data.preferredTags || []);
          setNotPreferredTags(data.notPreferredTags || []);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

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
