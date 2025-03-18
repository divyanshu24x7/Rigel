import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Send email and password to backend
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                //alert('Login successful!');
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('userId', data.userId)
                console.log(data.accessToken)
                console.log(data.userId)
                console.log("hello")
                // Navigate to a new page, e.g., dashboard or home
                navigate('/');

            } else {
                // Handle login failure (e.g., show error message)
                //alert(data.message || 'Invalid email or password');
                Swal.fire({
                    title: 'Error!',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Okay'
                })
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error during login');
        }
    };
    return (
        <div className='flex h-screen signup-background '>
            {/*sidebar*/}
            <div className='signup-left w-[516px] p-12 flex flex-col justify-center'>
                <h1 className='text-white text-3xl'>Rigel</h1>
                <h2 className='text-white text-lg font-bold mt-8'>Login to your account</h2>
                <p className='text-sm text-zinc-300 mt-0.5'>Don't have an account? <Link to="/auth/SignUp" className='text-violet-950 font-bold underline'>Sign Up</Link> for one</p>
                <form onSubmit={handleLogin}>
                    <div className='mt-8'>
                        <label htmlFor="" className='text-zinc-300 text-sm font-normal block mb-0.5'>Email address</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='you@example.com' type="email" className='block w-full signup-input rounded text-violet-950 px-4 py-2 text-sm' />
                    </div>
                    <div className='mt-6'>
                        <label htmlFor="" className='text-zinc-300 text-sm font-normal block mb-0.5'>Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='***************' type="password" className='block w-full signup-input rounded text-violet-950 px-4 py-2 text-sm' />
                    </div>

                    <div>
                        <button className='w-full mt-4 bg-violet-950 rounded-full px-4 py-2 text-sm font-bold text-white'>Login</button>
                    </div>
                </form>
            </div>
            {/*introduction*/}
            <div className='hidden md:flex flex-col w-full justify-center items-center'>
                <h1 className='text-9xl'>Welcome</h1>
                <h1 className='text-9xl'>Back.</h1>
            </div>
        </div>
    )
}

export default Login