import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About';
import Tags from './pages/Tags';
import Profile from './pages/Profile'
import Messages from './pages/Messages';
import ProtectedRoute from './components/ProtectedRoute';
const App = () => {

  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path='/auth/SignUp' element={<SignUp />} />
      <Route path='/Landing' element={<Landing />} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='messages' element={<Messages />} />
        <Route path='tags' element={<Tags />} />
        <Route path='profile' element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
