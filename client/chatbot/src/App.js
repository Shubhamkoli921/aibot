// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from './components/login';
import Dashboard from "./components/dashboard";
import SignUp from "./routes/signup";
import Login from "./routes/login";
import Err from "./routes/erro";
import { AuthProvider, useAuth } from "./authentication/authContext";
// import Profiles from './pages/Profiles';
// import User from './pages/user';
// import Report from './pages/report';
// import Signup from './components/signup';
// import Home from './components/home';

const App = () => {
  const { user } = useAuth();
  return (
    // <div>
    //   {user ? (
    //     <Dashboard user={user} />
    //   ) : (
    //     <Login onLogin={handleLogin} />
    //   )}
    // </div>
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path='/authentication/signup' element={<SignUp    />} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/error" element={<Err />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
