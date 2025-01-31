import React from "react";

const AboutComponent = () => {
  return (
    <div className="middle">
      <div className="feeds">
        <div className="feed">
          <div className="p-4 border rounded-xl">
            <h1 className="text-3xl font-bold mb-4">About</h1>
            <p className="text-base text-gray-600 mb-6">
              Welcome to Rigel, where meaningful connections are formed through
              creativity and self-expression. Inspired by platforms like Tinder
              and Omegle, Rigel combines the spontaneity of discovery with the
              thoughtful engagement of social sharing.
            </p>
            <h2 className="text-2xl font-semibold mb-3">What is Rigel?</h2>
            <p className="text-base text-gray-600 mb-4">
              Rigel is a platform designed to bring strangers together through
              captivating posts and conversations. Users can write short posts
              to showcase their personality and interests, with the goal of
              sparking engaging interactions.
            </p>
            <h2 className="text-2xl font-semibold mb-3">How Does It Work?</h2>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              <li>
                Explore an infinite deck of cards (posts) on the homepage.
              </li>
              <li>Swipe away posts you aren't interested in.</li>
              <li>
                Reply to posts that catch your attention and start
                conversations.
              </li>
            </ul>
            <h2 className="text-2xl font-semibold mb-3">Why Rigel?</h2>
            <p className="text-base text-gray-600 mb-4">
              We believe that connections happen not just through appearances
              but through compelling stories and thoughtful conversations. Rigel
              offers a space for you to stand out by expressing what makes you
              unique.
            </p>
            <h2 className="text-2xl font-semibold mb-3">Get Started</h2>
            <p className="text-base text-gray-600">
              Join Rigel, write your post, and connect with people who resonate
              with your vibe. Whether you're looking for friendships,
              inspiration, or just a good conversation, Rigel has something for
              everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutComponent;
