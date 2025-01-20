import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { Routes, Route } from 'react-router-dom'
const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/SignUp' element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
