// src/App.js
import React, { useState } from 'react';
import {BrowserRouter , Routes , Route} from 'react-router-dom'
// import Login from './components/login';
import Dashboard from './components/dashboard';
// import Profiles from './pages/Profiles';
// import User from './pages/user';
// import Report from './pages/report';
// import Signup from './components/signup';
// import Home from './components/home';

const App = () => {
  

  

  return (
    // <div>
    //   {user ? (
    //     <Dashboard user={user} />
    //   ) : (
    //     <Login onLogin={handleLogin} />
    //   )}
    // </div>
    <>
      <BrowserRouter>
        <Routes>
         
          <Route path='/dashboard' element={<Dashboard    />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
