import React from 'react'
import MessagesComponent from '../components/MessagesComponent'
import Navbar from '../components/Navbar'
import Left from '../components/Left'
import Right from '../components/Right'
const Messages = () => {
    return (
        <div>
            <nav>
                <Navbar />
            </nav>

            <main>
                <div className='container'>
                    <Left />
                    <MessagesComponent />
                    <Right />
                </div>
            </main>
        </div>
    )
}

export default Messages