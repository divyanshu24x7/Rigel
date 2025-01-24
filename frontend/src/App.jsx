import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/SignUp' element={<SignUp />} />
        <Route path='/Landing' element={<Landing/>}/>
      </Routes>
    </>
  );
};

export default App;
