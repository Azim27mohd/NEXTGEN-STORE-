// components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ userIsAdmin, userAuthenticated, handleLogout }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">
          NextGen Store
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/products" className="text-white hover:text-gray-300">
            Products
          </Link>
          <Link to="/cart" className="text-white hover:text-gray-300">
            Cart
          </Link>
          {userAuthenticated ? (
            <button onClick={handleLogout} className="text-white hover:text-gray-300">
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
