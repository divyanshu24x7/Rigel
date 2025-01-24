import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Left from '../components/Left';
import Middle from '../components/Middle';
import Right from '../components/Right';
import Navbar from '../components/Navbar';

const Home = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/auth/login');
        }
    }, [navigate]);

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
