import React from 'react';
import Left from '../components/Left';
import Middle from '../components/Middle';
import Right from '../components/Right';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div>
            <nav>
                <Navbar />
            </nav>

            <main>
                <div className='container'>
                    <Left />
                    <Middle />
                    <Right />
                </div>
            </main>
        </div>
    );
};

export default Home;
