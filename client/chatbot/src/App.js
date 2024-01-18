// src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


// import { AuthProvider, useAuth } from "./superadmin/authentication/authContext";
import Dashboard from "./superadmin/components/dashboard";
import Login from "./superadmin/routes/superadmin/login";
import AdminLogin from "./admin/routes/adminlogin";
import AdminSignup from "./admin/routes/adminsignup";
import UserManagement from "./superadmin/pages/timepass";
import AdminList from "./superadmin/pages/timepass";
import AdminDashBoard from "./admin/components/dashboard";
import Chat from "./chatbot/chatbot";
import Chatbot from "./chatbot/chatbot";
// import Hello from "./admin/components/hello";
// import PrivateRoute from "./privateroutes/privateroutes";
// import PrivateRoute from "./privateroutes/privateroutes";


const App = () => {
  // const { user } = useAuth();
  return (
    // <div>
    //   {user ? (
    //     <Dashboard user={user} />
    //   ) : (
    //     <Login onLogin={handleLogin} />
    //   )}
    // </div>
    <>
      hello plz provide routes
      {/* <AuthProvider> */}
        <BrowserRouter>
          <Routes>

            <Route path="/sup/dashboard" element={<Dashboard />} />
            <Route path="/adm/dashboard" element ={<AdminDashBoard />}/>
            <Route path="/superlogin" element={<Login />} />
            <Route path="/test" element={<AdminList />} />
            <Route path="/chat" element={<Chatbot />} />

            {/* <Route path="/adminsignup" element={<AdminSignup />} /> */}
           
          </Routes>
        </BrowserRouter>
      {/* </AuthProvider> */}
    </>
  );
};


export default App;
