import React from 'react'
import TagsComponent from '../components/TagsComponent'
import Navbar from '../components/Navbar'
import Left from '../components/Left'
import Right from '../components/Right'
const Tags = () => {
    return (
        <div>
            <nav>
                <Navbar />
            </nav>

            <main>
                <div className='container'>
                    <Left />
                    <TagsComponent />
                    <Right />
                </div>
            </main>
        </div>
    )
}

export default Tags