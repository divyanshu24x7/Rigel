import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate from React Router
import { SideData } from './SideData'

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate() // Initialize the navigate function

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  // Handle Sign Out
  const handleSignOut = () => {
    // Clear the session token from localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')

    // Optionally, redirect the user or show a message after sign out
    //alert('You have been signed out.')
    
    // Use navigate to redirect to the login page
    navigate('/auth/login') // Example: Redirect to the login page
  }

  return (
    <div className='h-full w-[20%] md:w-[15%] bg-rigelBlack relative'>
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

        {/* Profile Picture Icon */}
        <li className="m-6 mt-24">
          <div className="rounded-full flex items-center justify-center bg-gray-800 w-12 h-12 text-white cursor-pointer" onClick={toggleMenu}>
            <img src="your-profile-pic-url.jpg" alt="Profile" className="w-full h-full object-cover rounded-full" />
          </div>

          {/* Profile Menu */}
          {isMenuOpen && (
            <div className="absolute bottom-20 left-8 bg-rigelSalmon text-gray-700 rounded-lg p-4 w-[150px]">
              {/* Chat Bubble Tail */}
              <div className="absolute left-2 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-rigelSalmon border-r-8 border-r-transparent"></div>
              <button className="w-full text-left p-2 hover:bg-lightSalmon" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
