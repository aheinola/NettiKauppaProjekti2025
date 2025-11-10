require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('./database.js');

const app = express();
app.use(express.json());
app.use(cors());

const saltRounds = 10;

// 🧱 REGISTER USER
app.post('/shop_user/register', async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('shop_user')
      .insert([{ user_name, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    delete data.password;
    res.status(201).json({ message: 'User created', user: data });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}); 

// 🔑 LOGIN USER
app.post('/shop_user/login', async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const { data: user, error } = await supabase
      .from('shop_user')
      .select('*')
      .eq('user_name', user_name)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // ✅ Issue JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, user_name: user.user_name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    delete user.password;
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🧩 Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: 'Access denied. Token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    req.user = user; // Attach decoded payload
    next();
  });
}

// 🔒 Protected route example
app.get('/profile', authenticateToken, async (req, res) => {
  const { user_id } = req.user;

  const { data, error } = await supabase
    .from('shop_user')
    .select('user_id, user_name')
    .eq('user_id', user_id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  res.json({ message: 'Profile data', profile: data });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
