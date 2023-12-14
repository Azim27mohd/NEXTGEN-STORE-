// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/nav';
import Home from './components/home';
import Products from './components/products';
import Cart from './components/cart';
// import Admin from './pages/Admin';
import Login from './components/login';
import { AuthProvider } from './components/authcontext';

const App = () => {
  const [userIsAdmin, setUserIsAdmin] = useState(true); // Set to actual user role
  const [userAuthenticated, setUserAuthenticated] = useState(false); // Set to actual authentication state

  const handleLogout = () => {
    // Implement your logout logic here
    setUserAuthenticated(false);
  };

  return (
    <Router>
      <AuthProvider>
      <Navigation
        userIsAdmin={userIsAdmin}
        userAuthenticated={userAuthenticated}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/cart" element={<Cart/>} />
        {/* <Route path="/admin" component={Admin} /> */}
        <Route path="/login" element={<Login/>} />
      </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
