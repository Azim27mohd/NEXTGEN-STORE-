import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authcontext';
import Notification from './notification';
import { AuthProvider } from './authcontext'; // Import the useAuth hook

const Login = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const { login } = useAuth(); // Use the login function from the context

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Perform client-side validation if needed

    // Post credentials to the server for authentication
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        const { userId } = data; // Assuming the server sends back the userId upon successful login

        // Set authentication status to true and save the userId using the login function
        login(userId);
        // Navigate to the account page or home page (adjust accordingly)
        navigate('/products');
      } else {
        setNotification({ message: 'Authentication failed', type: 'error' });
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setNotification({ message: 'Error during authentication', type: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Login</h1>
      <p>Welcome back! Please login to continue.</p>

      <form>
        <div className="mt-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default Login;
