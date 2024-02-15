// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from '../src/state/store'; // Import your Redux store

import Dashboard from "./superadmin/components/dashboard";
import Login from "./superadmin/routes/superadmin/login";
import AdminList from "./superadmin/pages/timepass";
import AdminDashBoard from "./admin/components/dashboard";
import Chatbot from "./chatbot/chatbot";
import AdminLogin from "./admin/routes/adminlogin";

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Event handler functions to update username and password
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  
  return (
    <Provider store={store}> {/* Wrap your app with Provider and pass the Redux store */}
      <>
        {/* hello plz provide routes */}
        <BrowserRouter>
          <Routes>
            <Route path="/sup/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<AdminLogin username={username}
              password={password}
              onUsernameChange={handleUsernameChange}
              onPasswordChange={handlePasswordChange} />} />
            <Route path="/adm/dashboard" element={<AdminDashBoard />} />
            <Route path="/" element={<Login />} />
            <Route path="/test" element={<AdminList />} />
            <Route path="/chat/:adminId" element={<Chatbot />} />
          </Routes>
        </BrowserRouter>
      </>
    </Provider>
  );
};

export default App;
