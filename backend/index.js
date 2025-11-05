require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabase } = require('./database.js');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/products', async (request, response) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});