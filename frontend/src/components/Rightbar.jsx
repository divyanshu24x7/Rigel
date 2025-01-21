import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Rightbar = () => {
  const [tags, setTags] = useState([]);
  const n = 10; // Number of top tags to fetch

  useEffect(() => {
    // Fetch top tags from the server
    const fetchTags = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tags/top?n=${n}`);
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching top tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="h-full grow border-l border-gray-500 border-opacity-30 p-4 flex flex-col justify-between">
      {/* Search Bar */}
      <div className="w-[75%] h-11 flex items-center gap-2 border rounded-full border-gray-500 border-opacity-30 px-3 bg-rigelBlack">
        <SearchIcon className="text-gray-500" />
        <input
          type="search"
          placeholder="Search tags"
          className="flex-1 outline-none text-gray-500 bg-rigelBlack"
        />
      </div>

      {/* Trending Tags Section */}
      <div className="w-[75%] h-[75%] border rounded-lg border-gray-500 border-opacity-30">
        <h1 className="text-white text-2xl mt-4 ml-4">What's trending</h1>
        <div className="mt-4 ml-4 flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag._id}
                className="px-3 py-1 rounded-full bg-gray-700 text-white text-sm font-semibold"
              >
                #{tag.name} ({tag.frequency})
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-4">No tags available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
