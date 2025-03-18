import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
const SignUp = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch("http://localhost:5000/auth/SignUp", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()
            if (response.ok) {
                //alert('User registered successfully');
                // You can redirect or show success message
                Swal.fire({
                    title: 'Success!',
                    text: 'User Registered Succesfully',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                  })
                navigate("/auth/login")
            } else {
                //alert(data.message || 'Error during registration');
                Swal.fire({
                    title: 'Error!',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Okay'
                  })
            }
        } catch (error) {
            console.error("error:", error)
        }

    }
    return (
        <div className='flex h-screen signup-background '>
            {/*sidebar*/}
            <div className='bg-zinc-900 w-[516px] p-12 flex flex-col justify-center signup-left'>
                <h1 className='text-white text-3xl'>Rigel</h1>
                <h2 className='text-white text-lg font-bold mt-8'>Sign Up for a free account</h2>
                <p className='text-sm text-zinc-300 mt-0.5'>Already registered? <Link to="/auth/login" className='text-violet-950 font-bold underline'>Login</Link>  to your account</p>
                <form onSubmit={handleSignUp}>
                    <div className='mt-8'>
                        <label htmlFor="" className='text-zinc-300 text-sm font-normal block mb-0.5'>Email address</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='you@example.com' type="email" className='block w-full rounded text-violet-950 px-4 py-2 text-sm signup-input' />
                    </div>
                    <div className='mt-6'>
                        <label htmlFor="" className='text-zinc-300 text-sm font-normal block mb-0.5'>Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='***************' type="password" className='block w-full rounded text-violet-950 px-4 py-2 text-sm signup-input' />
                    </div>

                    <div>
                        <button className='w-full mt-4 bg-violet-950 rounded-full px-4 py-2 text-sm font-bold text-white'>Sign Up</button>
                    </div>
                </form>
            </div>
            {/*introduction*/}
            <div className='hidden md:flex flex-col w-full justify-center items-center'>
                <h1 className='text-9xl'>Create an</h1>
                <h1 className='text-9xl'>account.</h1>
            </div>
        </div>
    )
}

export default SignUp