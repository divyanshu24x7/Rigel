import React, { useState, useEffect } from 'react';
import SearchIcon from "@mui/icons-material/Search";

const Right = () => {
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch top tags (if no search query)
  const fetchTopTags = async () => {
    try {
      const response = await fetch("http://localhost:5000/tags/top?n=10");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      } else {
        console.error("Failed to fetch top tags");
      }
    } catch (error) {
      console.error("Error fetching top tags:", error);
    }
  };

  // Function to search tags based on the query
  const searchTags = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/tags/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      } else {
        console.error("Failed to search tags");
      }
    } catch (error) {
      console.error("Error searching tags:", error);
    }
  };

  // Effect to fetch top tags on mount or when searchQuery is empty
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchTopTags();
    } else {
      searchTags(searchQuery);
    }
  }, [searchQuery]);

  return (
    <div className="right">
      <div className="messages">
        <div className="heading">
          <h4>Tags</h4>
        </div>
        <div className="tags-container flex flex-wrap gap-2 p-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag._id}
                className="tag-bubble bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-lg btn-primary"
              >
                {tag.name} <span className="ml-1 text-sm">({tag.frequency})</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tags available.</p>
          )}
        </div>
        {/* Search bar with extra top margin */}
        <div className="search-bar mt-4 flex items-center gap-2">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search for tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Right;
