require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabase } = require('./database.js');
const app = express();
app.use(express.json());
app.use(cors());








const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World!');
});