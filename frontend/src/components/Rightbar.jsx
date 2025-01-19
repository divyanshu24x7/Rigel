import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

const Rightbar = () => {
  return (
    <div className="h-full grow border-l border-gray-500 border-opacity-30 p-4 flex flex-col justify-between">
      <div className="w-[75%] h-11 flex items-center gap-2 border rounded-full border-gray-500 border-opacity-30 px-3 bg-rigelBlack">
        <SearchIcon className="text-gray-500" />
        <input
          type="search"
          placeholder="Search tags"
          className="flex-1 outline-none text-gray-500 bg-rigelBlack"
        />
      </div>
      <div className='w-[75%] h-[75%] border rounded-lg border-gray-500 border-opacity-30'>
        <h1 className='text-white text-2xl mt-4 ml-4'>What's trending</h1>
      </div>
    </div>
  );
};

export default Rightbar;
