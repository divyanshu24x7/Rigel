import React from 'react'
import AboutComponent from '../components/AboutComponent'
import Navbar from '../components/Navbar'
import Left from '../components/Left'
import Right from '../components/Right'
const About = () => {
    return (
        <div>
            <nav>
                <Navbar />
            </nav>

            <main>
                <div className='container'>
                    <Left />
                    <AboutComponent />
                    <Right />
                </div>
            </main>
        </div>
    )
}

export default About