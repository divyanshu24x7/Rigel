import React, { useState } from 'react';

const CardSlider = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  return (
    <div className="w-full max-w-xl mx-auto overflow-hidden relative">
      <div className="h-40 flex items-center justify-center border rounded-lg bg-rigelSalmon shadow-md">
        <p className="text-gray-800 text-lg px-4 text-center">
          {cards[currentIndex]}
        </p>
      </div>

      <div className="flex items-center justify-center mt-4 space-x-4">
        <button
          onClick={handleNext}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Next
        </button>
        <button
          className="bg-rigelSalmon text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default CardSlider;
