import React, { useState } from 'react'
import AuthService from '../authentication/authservice';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const token = await AuthService.adminlogin({ username, password });
            console.log('Login successful. Token:', token);
            navigate('/private');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };


  return (
    <>
         <div>
            <h2>Login</h2>
            <label>Username: </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label>Password: </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button onClick={handleLogin}>Login</button>
        </div>
    </>
  )
}

export default AdminLogin