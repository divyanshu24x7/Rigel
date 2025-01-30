import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import profilePic from '../assets/profile-pic.png';

const ProfileComponent = () => {
  const [profilePicture, setProfilePicture] = useState(profilePic);
  const [username, setUsername] = useState('JohnDoe');
  const [bio, setBio] = useState('Just a mysterious internet wanderer.');
  const [preferredTags, setPreferredTags] = useState(['Tech', 'Anime', 'Music']);
  const [notPreferredTags, setNotPreferredTags] = useState(['Politics', 'Drama']);
  const [searchTag, setSearchTag] = useState('');

  const handleTagRemove = (tagList, setTagList, tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const handleTagAdd = (tagList, setTagList) => {
    if (searchTag && !tagList.includes(searchTag)) {
      setTagList([...tagList, searchTag]);
      setSearchTag('');
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
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-2"
              />
              <input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setProfilePicture(URL.createObjectURL(file));
                }}
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <h3 className="font-semibold">Username:</h3>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <h3 className="font-semibold">Bio:</h3>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Preferred Tags */}
            <div className="mb-4">
              <h3 className="font-semibold">Preferred Tags:</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {preferredTags.map((tag, index) => (
                  <div key={index} className="bg-blue-200 text-blue-800 rounded-full px-4 py-1 flex items-center">
                    {tag}
                    <button className="ml-2" onClick={() => handleTagRemove(preferredTags, setPreferredTags, tag)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={searchTag}
                  placeholder="Add a tag..."
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md flex-1"
                />
                <button onClick={() => handleTagAdd(preferredTags, setPreferredTags)} className="p-2 bg-blue-500 text-white rounded-md">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Not Preferred Tags */}
            <div className="mb-4">
              <h3 className="font-semibold">Not Preferred Tags:</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {notPreferredTags.map((tag, index) => (
                  <div key={index} className="bg-red-200 text-red-800 rounded-full px-4 py-1 flex items-center">
                    {tag}
                    <button className="ml-2" onClick={() => handleTagRemove(notPreferredTags, setNotPreferredTags, tag)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  value={searchTag}
                  placeholder="Add a tag..."
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md flex-1"
                />
                <button onClick={() => handleTagAdd(notPreferredTags, setNotPreferredTags)} className="p-2 bg-red-500 text-white rounded-md">
                  <Plus size={16} />
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

