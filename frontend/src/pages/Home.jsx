import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/Sidebar';
import Header from '../components/Header';
import Rightbar from '../components/Rightbar';
import Compose from '../components/Compose';
import CardSlider from '../components/CardSlider';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/auth/login');
        }
    }, [navigate]);

    const cards = [
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        "Here's some text for the second card.",
        "The third card contains this message.",
        "Another example for the fourth card.",
        "Finally, this is the fifth card."
    ];

    return (
        <div className="h-screen w-screen flex">
            <SideBar />
            <section className="w-full md:w-1/2 px-4 md:px-0">
                <Header />
                <Compose />
                <div className="mt-8 mx-auto">
                    <CardSlider cards={cards} />
                </div>
            </section>
            <div className="hidden md:flex md:w-1/3">
                <Rightbar />
            </div>
        </div>
    );
};

export default Home;
