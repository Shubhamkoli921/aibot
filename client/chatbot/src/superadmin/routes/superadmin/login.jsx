// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateToken, updateAdminId } from '../../../state/action';
import signibg from "../../assets/signin.jpg";
// import AdminDashBoard from '../../../admin/components/dashboard';

function Login({ updateToken, updateAdminId }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('superadminpassword');
  const [loginType, setLoginType] = useState('admin');

  const handleLogin = () => {
    const admin = { name: username, password: password };
    const superAdmin = { username: username, password: password };

    axios.post(
      loginType === 'admin' ? 'http://localhost:8000/login' : 'http://localhost:8000/superadmin/login',
      loginType === 'admin' ? admin : superAdmin
    )
      .then(response => {
        const { access_token, adminId } = response.data;
        updateToken(access_token);
        updateAdminId(adminId);
        console.log("sadmin>>>",adminId);
       
        if(loginType === 'admin'){
          navigate('/adm/dashboard', { state: { token: access_token, adminId: adminId } });
        }
        else{
          navigate('/sup/dashboard', {state: { token: access_token, adminId: adminId }})
        }
      })
      .catch(error => {
        console.error(error);
        // Handle error
      });
  };

  return (
    // <div className="w-full p-2 m-auto h-screen bg-slate-100">
    <div className="w-full p-2 m-auto h-screen bg-slate-100">
      <div className="object-contain absolute w-full h-screen ">
        <img
          src={signibg}
          className="object-cover h-screen rounded-xl w-full"
          alt=""
        />
      </div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex justify-center flex-col items-center absolute mt-10  ">
          <div className="w-[290px] bg-blue-500 h-[180px] rounded-xl shadow-md shadow-blue-300 absolute top-0 -mt-10 flex justify-center flex-col items-center">
            <h1 className="font-bold text-2xl text-white">Sign in</h1>
          </div>
          <div className="w-[320px] bg-white h-[500px] rounded-lg flex flex-col justify-end p-4">
            <div className="w-full  h-full flex flex-col mt-40 ">
              <input
                type="text"
                placeholder="username"
                className="border-2  flex items-center p-2 m-2 rounded-lg"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="border-2 flex items-center p-2 m-2 rounded-lg"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <span className="text-gray-400 text-center p-2">
              Sign In To Proceed
            </span>
            <button
              onClick={handleLogin}
              className="p-4 rounded-md text-white font-bold bg-blue-500 shadow-sm shadow-slate-900"
            >
              Sign in
            </button>
            <div>
              <p>Login Type:</p>
              <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* {console.log("token>>>>>", token)}
      {token && <AdminDashBoard token={token} adminId={adminId} />} */}
    </div>
    // </div>
  );
}

const mapDispatchToProps = {
  updateToken,
  updateAdminId,
};

export default connect(null, mapDispatchToProps)(Login);


