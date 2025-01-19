import React from 'react';
import SideBar from './components/Sidebar';
import Header from './components/Header';
import Rightbar from './components/Rightbar';
import Compose from './components/Compose';
import CardSlider from './components/CardSlider';

const App = () => {
  const cards = [
    "This is the first card content.",
    "Here's some text for the second card.",
    "The third card contains this message.",
    "Another example for the fourth card.",
    "Finally, this is the fifth card."
  ];

  return (
    <div className="h-screen w-screen flex">
      <SideBar />
      <section className="w-full md:w-1/2 px-4 md:px-0">
        <Header />
        <Compose />
        <div className="mt-8 mx-auto">
          <CardSlider cards={cards} />
        </div>
      </section>
      <div className="hidden md:flex md:w-1/3">
        <Rightbar />
      </div>
    </div>
  );
};

export default App;
