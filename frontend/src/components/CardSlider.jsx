
import React, { useState } from 'react';

const CardSlider = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden relative">
      {/* Card */}
      <div className="min-h-[300px] max-w-full flex items-center justify-center border rounded-lg bg-rigelSalmon shadow-md p-6">
        <p className="text-gray-1000 font-semibold text-lg leading-relaxed text-center">
          {cards[currentIndex]}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center mt-4 space-x-4">
        <button
          onClick={handleNext}
          className="bg-gray-200 font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Next
        </button>
        <button
          className="bg-rigelSalmon font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-lightSalmon"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default CardSlider;