import React from 'react'
import ProfileComponent from '../components/ProfileComponent'
import Navbar from '../components/Navbar'
import Left from '../components/Left'
import Right from '../components/Right'
const Profile = () => {
    return (
        <div>
            <nav>
                <Navbar />
            </nav>

            <main>
                <div className='container'>
                    <Left />
                    <ProfileComponent />
                    <Right />
                </div>
            </main>
        </div>
    )
}

export default Profile