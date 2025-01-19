import React from 'react'
import { SideData } from './SideData'
import logo from '../assets/logo.png'

const Sidebar = () => {
  return (
    <div className='h-full w-[15%] bg-rigelBlack relative'>
      <div className="absolute right-0 top-0 h-full w-[1px] bg-gray-500 opacity-30"></div>
      <ul className='absolute right-0'>
        {
          SideData.map((val, key) => {
            return (
              <li key={key}>
                <div className={`m-4 rounded-full flex items-center justify-center ${val.title === 'Post' ? 'bg-white text-black w-16 h-16' : 'hover:bg-gray-800 w-12 h-12 text-white'
                  }`}
                >{val.icon}</div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default Sidebar