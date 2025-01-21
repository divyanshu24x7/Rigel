import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/Sidebar';
import Header from '../components/Header';
import Rightbar from '../components/Rightbar';
import Compose from '../components/Compose';
import CardSlider from '../components/CardSlider';
import axios from 'axios';

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

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/messages?page=${page}&limit=10`);
                if (res.data.length === 0) {
                    setHasMore(false); // No more messages to fetch
                } else {
                    setMessages((prev) => [...prev, ...res.data.map((msg) => msg.content)]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [page]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 10 &&
            hasMore
        ) {
            setPage((prev) => prev + 1); // Load next page
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <div className="h-screen w-screen flex">
            <SideBar />
            <section className="w-full md:w-1/2 px-4 md:px-0">
                <Header />
                <Compose />
                <div className="mt-8 mx-auto">
                    <CardSlider cards={messages} />
                </div>
            </section>
            <div className="hidden md:flex md:w-1/3">
                <Rightbar />
            </div>
        </div>
    );
};

export default Home;
