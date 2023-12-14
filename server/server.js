// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the local MongoDB server and use the 'localstore' database
mongoose.connect('mongodb://127.0.0.1:27017/localstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define MongoDB schemas and models for 'users' and 'products'
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  cart: [
    {
      productId: Number,
      quantity: Number,
      name: String,
      price: Number,
      // Add more product details as needed
    },
  ],
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// API routes for users

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      // If the user doesn't exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

      const newUser = new User({
        username,
        password: hashedPassword,
        isAdmin: false,
      });

      await newUser.save();

      res.status(201).json({ success: true, userId: newUser._id });
    } else {
      // If the user exists, check the password
      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      if (passwordMatch) {
        res.status(200).json({ success: true, userId: existingUser._id });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// API route for fetching user's cart details
app.get('/api/cart/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user's cart details
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    const newUser = new User({ username, password, isAdmin });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// API routes for products
app.get('/api/products', async (req, res) => {
  try {
    // Sample product data (replace with actual data from your database)
    const sampleProducts = [
      {
        id: 1,
        name: ' ',
        price: 999.99,
        description: 'Powerful laptop with high-performance features.',
        image: 'https://imgs.search.brave.com/dS6CnCuHuN5hBBvHKVUDxJ2VBGKPe41HbhUexg_xNeY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9jZG4u/dGhld2lyZWN1dHRl/ci5jb20vd3AtY29u/dGVudC9tZWRpYS8y/MDIzLzA2L2xhcHRv/cHN1bmRlcjUwMC0y/MDQ4cHgtYWNlcmFz/cGlyZTNzcGluMTQu/anBn',
      },
      {
        id: 2,
        name: 'Smartphone',
        price: 599.99,
        description: 'The latest smartphone with advanced features.',
        image: 'https://imgs.search.brave.com/jfVUsQ6-XuLNsxxWLVk77iwmkSfZuGAZs79fU_vAd0U/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMTAwMDEy/OC81OTc0L2kvNDUw/L2RlcG9zaXRwaG90/b3NfNTk3NDQ4Mzkt/c3RvY2stcGhvdG8t/Y29sbGVjdGlvbi1v/Zi1tb2Rlcm4tdG91/Y2hzY3JlZW4tc21h/cnRwaG9uZXMuanBn',
      },
      {
        id: 3,
        name: 'Headphones',
        price: 79.99,
        description: 'Premium over-ear headphones with noise-canceling technology.',
        image: 'https://imgs.search.brave.com/lJic5OrYlHvOdAihT-GOYHu0vV_zHFTvwGLbo9Cw2RA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzgxLzgxLzM1/LzM2MF9GXzU4MTgx/MzU2Nl9lNHl3ZGJr/VFl2eE1iY0RPTDZl/ang1V2NZZHlTUWVa/ai5qcGc',
      },
      {
        id: 4,
        name: 'Wireless Mouse',
        price: 29.99,
        description: 'Sleek and ergonomic wireless mouse for comfortable use.',
        image: 'https://imgs.search.brave.com/NMJfxucihWe38ewkOm36HXxKIOxd858_T_sf3TTMVso/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzI1LzQ1LzIw/LzM2MF9GXzUyNTQ1/MjA0N19qT1JGZUNx/NHBqQUcwS1FPelhm/YWZkYm5GUloyTEd4/Ry5qcGc',
      },
      {
        id: 5,
        name: 'Fitness Tracker',
        price: 49.99,
        description: 'Track your fitness goals with this advanced fitness tracker.',
        image: 'https://imgs.search.brave.com/CmUFU7DYzr7yRX1zS9EwVC_BxS_bG_OdCq4n4iIn_Z0/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzM4LzIyLzEy/LzM2MF9GXzIzODIy/MTI2MV9QZXFucmVu/aVQ2dlBwY2VrYWVC/T1FqTWRrc0VDYmpa/cS5qcGc',
      },
      {
        id: 6,
        name: 'Coffee Maker',
        price: 89.99,
        description: 'Start your day with the perfect cup of coffee from this coffee maker.',
        image: 'https://imgs.search.brave.com/5jVOI3xRdOH8kiz1-C1tHis7WCb6Vj-fQ9el9h7lzzA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jb2ZmZWUtbWFr/ZXJfMTUyMjkwLTEu/anBnP3NpemU9NjI2/JmV4dD1qcGc',
      },
    ];

    res.json(sampleProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/products', async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/cart', async (req, res) => {
  try {
    const { userId, productId, quantity, name, price } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product is already in the user's cart
    const existingProduct = user.cart.find((item) => item.productId.toString() === productId.toString());

    if (existingProduct) {
      // If the product is already in the cart, update the quantity
      existingProduct.quantity += quantity || 1;
    } else {
      // If the product is not in the cart, add it
      const productDetails = {
        productId,
        quantity: quantity || 1,
        name,
        price,
      };
      user.cart.push(productDetails);
      console.log('added')
    }

    // Save the updated user data with the cart to the database
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/', async (req, res) => {
  res.json({'hola': 'user'})
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
