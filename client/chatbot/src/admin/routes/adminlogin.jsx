import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { name: username, password: password })
      .then(response => {
        localStorage.setItem('token', response.data.access_token);
        console.log("token>>>>>",response.data.access_token)
        alert("login successfully")
        navigate('/adm/dashboard')
        // Redirect to another page or perform any other action upon successful login
      })
      .catch(error => {
        console.error(error);
        setError('Invalid credentials'); // Update error state
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if exists */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
