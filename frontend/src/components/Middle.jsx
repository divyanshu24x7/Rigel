import React, { useState, useRef, useEffect } from "react";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
// import profilepic from "../assets/profile-pic.png";
import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
// import ReplyModal from "./ReplyModal"; // Import the modal component
import { useNavigate } from "react-router-dom";

const Middle = () => {
  const [profilePicture, setProfilePicture] = useState("profilePicture");
  const [authorId, setAuthorId] = useState("");
  const [authorProfilePicture, setAuthorProfilePicture] = useState("profilePicture");
  const [authorUsername, setAuthorUsername] = useState("");
  const [inputText, setInputText] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // State for the file
  const fileInputRef = useRef(null); // Reference for hidden file input
  const [currentPostIndex, setCurrentPostIndex] = useState(0); // Track the current post index
  const [currentPost, setCurrentPost] = useState(null); // Store the current post data
  // const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const navigate = useNavigate();

 // Inside Middle.jsx
 const handleInitiateConversation = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (currentPost) {
      await markPostAsSeen(currentPost._id); // Mark the current post as seen
    }
    const response = await fetch("http://localhost:5000/conversations/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiverId: authorId, // The post's author becomes the receiver
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Conversation created or already exists:", data);
      // Redirect to the messages page (which will load and display the conversation)
      navigate("/messages");
    } else {
      const errorData = await response.json();
      console.error("Error initiating conversation:", errorData);
      alert(errorData.error || "Failed to initiate conversation");
    }
  } catch (error) {
    console.error("Error initiating conversation:", error);
  }
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

  const fetchAuthorData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:5000/profile/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthorUsername(data.username || "Anonymous");
        setAuthorProfilePicture(data.profilePicture);
      } else {
        console.error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };  

  const fetchPost = async (index) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5000/messages/${index}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAuthorId(data.authorId);
        setCurrentPost(data);
      } else {
        console.error(await response.json());
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const markPostAsSeen = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:5000/messages/${postId}/seen`, {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error marking post as seen:", error);
    }
  };

  // Initial fetch for the latest post (index 0)
  useEffect(() => {
    fetchProfileData();
    fetchPost(0);
    // Remove fetchAuthorData() from here
  }, []);
  
  useEffect(() => {
    if (!authorId) return;
    fetchAuthorData();
  }, [authorId]);
  

  const handleNext = async () => {
    if (currentPost) {
      await markPostAsSeen(currentPost._id); // Mark the current post as seen
    }
    const newIndex = currentPostIndex + 1;
    setCurrentPostIndex(newIndex);
    fetchPost(newIndex); // Fetch the next post
  };

  const handleInput = (event) => {
    const maxLength = 500;
    const value = event.target.value;
    if (value.length <= maxLength) {
      setInputText(value);
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    }
  };

  const handleTagInput = (event) => {
    setTagInput(event.target.value);
  };

  const handleTagKeyDown = (event) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const remainingChars = 500 - inputText.length;

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]); // Save the selected file
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null); // Reset file state
  };

  const handlePost = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");

    // Create FormData
    const formData = new FormData();
    formData.append("content", inputText);
    formData.append("tags", JSON.stringify(tags)); // Serialize tags as a string
    if (selectedFile) {
      formData.append("image", selectedFile); // Append the file
    }

    try {
      const response = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData, // Use FormData
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setInputText("");
        setTags([]);
        setSelectedFile(null); // Reset file state
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="middle">
      <form className="create-post" onSubmit={handlePost}>
        <div className="flex items-start gap-4 w-full">
          <div className="profile-photo">
            <img src={`http://localhost:5000${profilePicture}`} alt="Profile" />
          </div>
          <div className="w-full">
            <textarea
              placeholder="Write here.."
              rows="1"
              style={{ resize: "none", overflow: "hidden" }}
              value={inputText}
              onInput={handleInput}
              className="w-full mt-4 border-b-2 border-gray-300 px-3 py-2"
            />
            <div className="flex flex-col">
              <div className="flex items-center">
                <span>
                  <AttachmentOutlinedIcon
                    className="mr-2 cursor-pointer"
                    onClick={handleFileInputClick}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </span>
                <span>
                  <BookmarkBorderOutlinedIcon />
                </span>
                <input
                  type="text"
                  placeholder="Type tags separated by comma"
                  className="w-full border-b-2 border-gray-300 px-3 py-2"
                  value={tagInput}
                  onChange={handleTagInput}
                  onKeyDown={handleTagKeyDown}
                />
                <div className="flex flex-col items-center justify-center mt-4">
                  <input
                    type="submit"
                    value="Post"
                    className="btn btn-primary"
                  />
                  <small
                    className={`block mt-1 text-sm ${
                      remainingChars <= 50 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {remainingChars} chars left
                  </small>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => handleTagRemove(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={handleFileRemove}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className="feeds">
        {currentPost ? (
          <div className="feed">
            <div className="head">
              <div className="user">
                <div className="profile-photo">
                  <img src={`http://localhost:5000${authorProfilePicture}`} alt="Feed Profile" />
                </div>
                <div className="info">
                  <h3>{authorUsername || "Anonymous"}</h3>
                  <small>
                    {/* {currentPost.location || "Unknown"},{" "} */}
                    {new Date(currentPost.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
            <div className="text-content">
              <p>{currentPost.content || "No content available."}</p>
            </div>
            {currentPost.imageUrl && (
              <div className="photo">
                <img
                  src={`http://localhost:5000${currentPost.imageUrl}`}
                  alt="Feed Content"
                />
              </div>
            )}
            <div className="action-buttons flex flex-wrap items-center gap-4">
              <div className="interaction-buttons flex flex-wrap items-center gap-2">
                <span>
                  <BookmarkBorderOutlinedIcon />
                </span>
                <div className="tag-bubbles flex flex-wrap gap-2">
                  {currentPost.tags &&
                    currentPost.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        <span>#{tag}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="reply-next-buttons flex gap-2 ml-auto">
                <button className="btn btn-primary" onClick={handleInitiateConversation}>Reply</button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading post...</p>
        )}
      </div>
    </div>
  );
};

export default Middle;
