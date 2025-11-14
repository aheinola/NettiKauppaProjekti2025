require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabase } = require('./database.js');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/category', async (request, response) => {
  const {data, error} = await supabase
  .from('category')
  .select('*')
  if (error) {
    console.error('Error fetching categories:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
})

app.get('/products', async (request, response) => {
  const { data, error } = await supabase.from('products').select('*').limit(4);
  if (error) {
    console.error('Error fetching products:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
}); 

app.get('/products/category/:category', async (request, response) => {
  const { category } = request.params;
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('product_category', category);
   
  if (error) {
    console.error('Error fetching products by category:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  
  response.json(data);
});

app.get('/products/:id', async (request, response) => {
  const { id } = request.params;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('product_id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return response.status(404).json({ error: 'Product not found' });
    }
    console.error('Error fetching product:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

app.post('/products', async (request, response) => {
  const body = request.body;
  const { data, error } = await supabase
    .from('products')
    .insert([{product_name: body.product_name, product_price: body.product_price, product_category: body.product_category }])
    .select()
    .single();
  if (error) {
    console.error('Error creating product:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.status(201).json(data);
});

app.delete('/products/:id', async (request, response) => {
  const { id } = request.params;
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('product_id', id)
    .select();
  response.json(data);
  if (error) {
    console.error('Error deleting product', error);
    return response.status(500).json({ error: 'Database error' });
  }
});

app.get('/shop_user', async (request, response) => {
  const { data, error } = await supabase.from('shop_user').select('*');
  if (error) {
    console.error('Error fetching user:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

app.get('/shop_user/:id', async (request, response) => {
  const { id } = request.params;
  const { data, error } = await supabase
    .from('shop_user')
    .select('*')
    .eq('user_id', id)
    .single();
  if (error) { 
    if (error.code === 'PGRST116') { // Not found
      return response.status(404).json({ error: 'User not found' });
    }
    console.error('Error fetching user:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

app.post('/shop_user', async (request, response) => {
  const body = request.body;
  const { data, error } = await supabase
    .from('shop_user')
    .insert([{user_name: body.user_name }])
    .select()
    .single();
  if (error) {
    console.error('Error creating user:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.status(201).json(data);
});

app.delete('/shop_user/:id', async (request, response) => {
  const { id } = request.params;
  const { data, error } = await supabase
    .from('shop_user')
    .delete()
    .eq('user_id', id)
    .select();
  response.json(data);
  if (error) {
    console.error('Error deleting user', error);
    return response.status(500).json({ error: 'Database error' });
  }
});

// Get user's cart with product details
app.get('/cart/:user_id', async (request, response) => {
  const { user_id } = request.params;
  const { data, error } = await supabase
    .from('cart')
    .select('*, products(*)')
    .eq('user_id', user_id);
  
  if (error) {
    console.error('Error fetching cart:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

// Add item to cart
app.post('/cart', async (request, response) => {
  const { user_id, product_id, quantity } = request.body;
  
  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', user_id)
    .eq('product_id', product_id)
    .single();
  
  if (existing) {
    // Update quantity if exists
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: existing.quantity + quantity })
      .eq('cart_id', existing.cart_id)
      .select();
    
    if (error) {
      console.error('Error updating cart:', error);
      return response.status(500).json({ error: 'Database error' });
    }
    return response.json(data);
  }
  
  // Insert new item
  const { data, error } = await supabase
    .from('cart')
    .insert([{ user_id, product_id, quantity }])
    .select();
  
  if (error) {
    console.error('Error adding to cart:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.status(201).json(data);
});

// Update cart item quantity
app.put('/cart/:cart_id', async (request, response) => {
  const { cart_id } = request.params;
  const { quantity } = request.body;
  
  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('cart_id', cart_id)
    .select();
  
  if (error) {
    console.error('Error updating cart:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

// Remove item from cart
app.delete('/cart/:cart_id', async (request, response) => {
  const { cart_id } = request.params;
  
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('cart_id', cart_id);
  
  if (error) {
    console.error('Error removing from cart:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.status(204).send();
});

// Clear entire cart for user
app.delete('/cart/user/:user_id', async (request, response) => {
  const { user_id } = request.params;
  
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', user_id);
  
  if (error) {
    console.error('Error clearing cart:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.status(204).send();
});

// Create order from cart
app.post('/orders', async (request, response) => {
  const { user_id, name, email, address } = request.body;
  
  try {
    // Get cart items with product details
    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', user_id);
    
    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return response.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => 
      sum + (item.products.product_price * item.quantity), 0
    );
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id, total_price: total, status: 'pending', name, email, address }])
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }
    
    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.product_price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }
    
    // Clear cart
    const { error: clearError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user_id);
    
    if (clearError) {
      console.error('Error clearing cart:', clearError);
      throw clearError;
    }
    
    response.status(201).json({ order, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    response.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get all orders
app.get('/orders', async (request, response) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

// Get user's orders
app.get('/orders/:user_id', async (request, response) => {
  const { user_id } = request.params;
  
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', user_id)
    .order('order_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  response.json(data);
});

// Get reviews for a product
app.get('/reviews/:product_id', async (request, response) => {
  const { product_id } = request.params;
  
  const { data, error } = await supabase
    .from('reviews')
    .select('*, shop_user(user_name)')
    .eq('product_id', product_id);
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return response.status(500).json({ error: 'Database error', details: error.message });
  }
  response.json(data);
});

// Get average rating for a product
app.get('/reviews/:product_id/average', async (request, response) => {
  const { product_id } = request.params;
  
  const { data, error } = await supabase
    .from('reviews')
    .select('review_number')
    .eq('product_id', product_id);
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return response.status(500).json({ error: 'Database error' });
  }
  
  if (!data || data.length === 0) {
    return response.json({ average: 0, count: 0 });
  }
  
  const average = data.reduce((sum, review) => sum + review.review_number, 0) / data.length;
  response.json({ average: average.toFixed(1), count: data.length });
});

// Create a review
app.post('/reviews', async (request, response) => {
  const { product_id, review_number, review_comment, user_id } = request.body;
  
  // Validate review_number is between 1 and 5
  if (!review_number || review_number < 1 || review_number > 5) {
    return response.status(400).json({ error: 'Review number must be between 1 and 5' });
  }
  
  const reviewData = {
    product_id,
    review_number,
    review_comment: review_comment || '',
    user_id: user_id || null
  };
  
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select('*, shop_user(user_name)')
    .single();
  
  if (error) {
    console.error('Error creating review:', error);
    return response.status(500).json({ error: 'Database error', details: error.message });
  }
  response.status(201).json(data);
});

// Get all reviews
app.get('/reviews', async (request, response) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*');
  
  if (error) {
    console.error('Error fetching reviews:', error);
    return response.status(500).json({ error: 'Database error', details: error.message });
  }
  response.json(data);
});

// Magic link authentication
app.post('/auth/magic-link', async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(400).json({ error: 'Email is required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:5173/auth/callback',
      }
    });

    if (error) {
      console.error('Magic link error:', error);
      return response.status(400).json({ error: error.message });
    }

    response.json({ 
      message: 'Magic link sent successfully',
      data 
    });
  } catch (err) {
    console.error('Server error:', err);
    response.status(500).json({ error: 'Server error' });
  }
});

// Verify magic link token
app.post('/auth/verify', async (request, response) => {
  const { access_token, refresh_token } = request.body;

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token
    });

    if (error) {
      return response.status(400).json({ error: error.message });
    }

    // Get or create user in shop_user table
    const { data: { user } } = await supabase.auth.getUser(access_token);
    
    if (user) {
      // Check if user exists in shop_user table
      const { data: shopUser, error: userError } = await supabase
        .from('shop_user')
        .select('*')
        .eq('user_email', user.email)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist, create them
        const userName = user.email.split('@')[0];
        const { data: newUser } = await supabase
          .from('shop_user')
          .insert([{
            user_name: userName,
            user_email: user.email
          }])
          .select()
          .single();

        return response.json({
          message: 'Login successful',
          user: newUser,
          session: data.session
        });
      }

      response.json({
        message: 'Login successful',
        user: shopUser,
        session: data.session
      });
    }
  } catch (err) {
    console.error('Verification error:', err);
    response.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});