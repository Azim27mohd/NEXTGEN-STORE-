// pages/Products.js
import React, { useState, useEffect } from 'react';
import { useAuth } from './authcontext';
import Notification from './notification';

const Products = () => {
  const { userId } = useAuth();
  const [notification, setNotification] = useState(null);


  const [products, setProducts] = useState([]);

  // Assuming you have an API endpoint for fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from your API endpoint
        const response = await fetch('http://localhost:5000/api/products'); // Replace with your actual API endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      // Check if the user is authenticated and has a user ID
      if (!userId) {
        console.error('User not authenticated. Unable to add to cart.');
        return;
      }

      // Fetch product details based on productId
      const selectedProduct = products.find((product) => product.id === productId);

      // Send a request to add the product to the user's cart
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          // Add more product details as needed
        }),
      });

      if (response.ok) {
        console.log('Product added to the cart successfully.');
        setNotification({ message: 'Product added to cart', type: 'success' });
      } else {
        console.error('Failed to add the product to the cart.');
      }
    } catch (error) {
      console.error('Error adding product to the cart:', error);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };
  
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4">Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <img
                src={product.image} // Replace with the actual image source
                alt={product.name}
                className="w-full h-32 object-cover mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              <button className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600" onClick={() => addToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
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

export default Products;
