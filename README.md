# Rigel

Rigel is a full-stack social media platform designed to connect users through personalized content, real-time messaging, and robust profile management. This work-in-progress application leverages modern technologies such as React, Node.js, Express, MongoDB, and Socket.IO to deliver an engaging, real-time user experience with a focus on tag-based content filtering and interactive chats.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Data Models](#architecture--data-models)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Known Issues & Future Improvements](#known-issues--future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Rigel is designed to be a dynamic and personalized social platform where users can:
- Create and share posts enriched with images and tags.
- Filter posts based on their preferred and disliked tags using MongoDB aggregations.
- Manage their profiles, including bio, username, and tag preferences.
- Engage in real-time conversations via an integrated messaging system that leverages Socket.IO.
- Enjoy an evolving user experience that continuously adapts to their interests and social interactions.

This project is a work in progress and is actively being developed and improved. The core concept is to build a platform that feels both personal and interactive, enabling users to not only consume content but also interact through real-time messaging and tag-based content curation.

---

## Features

- **User Profiles:**  
  - Fetch, display, and update profile information (bio, username, profile picture).
  - Manage preferred and not-preferred tags to influence content filtering.

- **Post Feed:**  
  - Create posts with text, images, and tags.
  - Filter posts using MongoDB aggregations based on user tag preferences.
  - Mark posts as seen and handle pagination.

- **Real-Time Messaging:**  
  - Conversations are modeled using two collections: one for conversation metadata and another for individual chat messages.
  - Real-time chat functionality implemented with Socket.IO.
  - Conversation list displays the other party’s profile photo and username.

- **Tag Filtering:**  
  - Posts are filtered based on the user’s liked (preferred) and disliked (not-preferred) tags.
  - Utilizes MongoDB’s aggregation framework for efficient querying.

- **File Uploads:**  
  - Image uploads for posts and profile pictures handled via Multer.
  - Static serving of uploaded images from designated directories.

- **Authentication & Authorization:**  
  - JSON Web Tokens (JWT) used for secure authentication.
  - Protected routes ensuring that only authorized users can access certain endpoints.

---

## Tech Stack

- **Frontend:**  
  - **React** with functional components and hooks  
  - **Vite** for fast development and bundling  
  - **Tailwind CSS** for styling (or your preferred CSS framework)  
  - **Socket.IO Client** for real-time messaging

- **Backend:**  
  - **Node.js** with **Express** for building the REST API  
  - **Socket.IO** for real-time WebSocket communication  
  - **MongoDB** for data storage, using **Mongoose** for schema-based modeling  
  - **JWT (jsonwebtoken)** for authentication  
  - **Multer** for handling file uploads  
  - **dotenv** for environment variable management

---

## Architecture & Data Models

### **Data Models**

1. **User:**  
   Contains user credentials, profile information (username, bio, profilePic), tag preferences (preferredTags, notPreferredTags), and other metadata.

2. **Post (Message):**  
   Stores post content, associated tags, image URL, author reference, and a map of users who have seen the post.

3. **Conversation:**  
   Represents a conversation between two users. Contains:
   - An array of participants (references to User documents).
   - Last message summary (content and timestamp).

4. **Chat:**  
   Represents individual messages within a conversation. Contains:
   - Reference to the Conversation document.
   - Sender, message content, timestamp, and an optional list of users who have read the message.

### **Architecture**

- **Server:**  
  The Express server is wrapped in an HTTP server and enhanced with Socket.IO for real-time communication. It handles API routes for authentication, profile management, posts, tag handling, and real-time chat messaging.
  
- **Client:**  
  A React-based frontend communicates with the backend via REST endpoints for initial data fetching and uses Socket.IO for real-time updates in messaging.

- **Real-Time Messaging Flow:**  
  When a user sends a chat message:
  - The client makes a POST request to the `/conversations/:id/chats` endpoint.
  - The server saves the message and emits a `newMessage` event via Socket.IO.
  - Other clients in the same conversation room receive the event and update their UI in real time.

---

## Installation & Setup

### **Prerequisites**

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/) installed and running
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### **Backend Setup**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/rigel.git
   cd rigel
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rigel
   ACCESS_TOKEN_SECRET=your_secret_key
   ```

4. **Run the Server:**

   ```bash
   npm run start
   ```

   The server will start on `http://localhost:5000`.

### **Frontend Setup**

1. **Navigate to the Frontend Directory:**

   ```bash
   cd frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   The frontend will be available on `http://localhost:3000`.

---

## Environment Variables

- **PORT:** The port on which the backend server runs.
- **MONGO_URI:** MongoDB connection string.
- **ACCESS_TOKEN_SECRET:** Secret key used for JWT authentication.
- (Additional variables can be added as needed.)

---

## API Endpoints

Below is a brief overview of the main API endpoints:

### **Authentication**
- `POST /auth` – Handle user login and registration.

### **Profile**
- `GET /profile` – Fetch logged-in user’s profile.
- `PUT /profile` – Update user bio.
- `PUT /profile/username` – Update user username.
- `PUT /profile/tags` – Update user’s preferred and not-preferred tags.
- `GET /profile/:id` – Fetch profile of a specific user.
- `POST /upload-profile-pic` – Upload and update profile picture.

### **Posts / Messages**
- `GET /messages` – Fetch posts with pagination.
- `POST /messages` – Create a new post.
- `PUT /messages/:id/seen` – Mark a post as seen.
- `GET /messages/:position` – Fetch a specific post by position.

### **Conversations & Chats**
- `POST /conversations/init` – Initiate a conversation between users.
- `GET /conversations` – Fetch all conversations for the logged-in user (with populated participant info).
- `GET /conversations/:id/chats` – Fetch chat messages for a specific conversation.
- `POST /conversations/:id/chats` – Send a chat message in a conversation (also emits a Socket.IO event).

---

## Folder Structure

```
rigel/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Messages.js
│   │   ├── Tags.js
│   │   ├── Conversation.js
│   │   └── Chat.js
│   ├── routes/
│   │   └── auth.js
│   ├── uploads/
│   ├── profile_pics/
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProfileComponent.jsx
    │   │   ├── Middle.jsx
    │   │   └── MessagesComponent.jsx
    │   ├── App.jsx
    │   └── index.jsx
    ├── public/
    ├── vite.config.js
    └── package.json
```

---

## Known Issues & Future Improvements

- **Real-Time Messaging:**  
  While Socket.IO integration is in place, further improvements can be made to optimize reconnections and handle edge cases.
- **Optimistic UI Updates:**  
  Deduplication of messages and better error handling for optimistic updates in the chat interface.
- **Enhanced Tag Filtering:**  
  More sophisticated tag-based recommendations and post filtering based on user behavior.
- **UI/UX Enhancements:**  
  Refining the user interface for mobile responsiveness and overall design polish.
- **Security:**  
  Additional security measures such as rate limiting, input sanitization, and enhanced authentication flows.

*Note: Rigel is a work in progress. Contributions, bug reports, and suggestions are welcome as we continue to improve the platform!*

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code adheres to our coding guidelines and that all tests pass.

---

## License

This project is licensed under the GNU General Public License v2.0 License. See the [LICENSE](LICENSE) file for details.

---

## Authors

- **Karan Pratap Shaw** ([GitHub](https://github.com/iCaran))
- **Divyanshu Kumar**

---

Feel free to modify this README to suit your project's needs. Rigel is continuously evolving, so please refer to the latest documentation and commit messages for up-to-date information.

